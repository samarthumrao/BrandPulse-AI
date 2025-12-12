import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, Platform, Sentiment } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeBrand = async (brandName: string): Promise<AnalysisResult> => {
  // Using gemini-2.5-flash for speed and search capability
  const model = "gemini-2.5-flash";
  
  const schemaDefinition = JSON.stringify({
    brandName: "string",
    overallScore: "number (0-100)",
    totalPosts: "number",
    summary: "string",
    sentimentDistribution: {
      positive: "number",
      neutral: "number",
      negative: "number"
    },
    sponsorshipInsights: {
      verdict: "string (Highly Recommended | Recommended | Caution | Not Recommended)",
      brandSafetyScore: "number (0-100)",
      engagementRate: "string",
      audienceDemographics: {
        ageGroup: "string",
        genderSplit: "string",
        topInterests: ["string"]
      },
      riskFactors: ["string"],
      reachEstimation: "string",
      brandValueImpact: "string",
      followerGrowthPrediction: "string",
      authenticityScore: "number",
      growthTrend: "string (Explosive | Steady | Stagnant | Declining)",
      competitorSaturation: "string (High | Medium | Low)",
      pastCollaborations: ["string"]
    },
    posts: [{
      id: "string",
      content: "string",
      platform: "string (Twitter | Facebook | Reddit | YouTube | Instagram | News)",
      sentiment: "string (Positive | Negative | Neutral)",
      author: "string",
      timestamp: "string",
      likes: "number"
    }]
  }, null, 2);

  const prompt = `
    Perform a targeted real-time web search for "${brandName}". 
    Focus specifically on finding recent discussions, comments, videos, and posts from:
    - **YouTube** (Video titles, descriptions, channel names)
    - **Reddit** (Thread titles, top comments)
    - **Instagram** (Captions, public profiles)
    - **Twitter/X** (Recent tweets)
    
    Based *strictly* on the actual search results found:
    
    1. **Real Content Extraction**: Extract 10-15 actual quotes, titles, or text snippets found in the search results. 
       - **DO NOT GENERATE FAKE POSTS**. 
       - If you find a YouTube video, use the video title as the content and "YouTube" as the platform.
       - If you find a Reddit thread, use the thread title or a top comment.
       - If specific social posts are blocked, use News Headlines covering the brand and label platform as "News".
    
    2. **Analysis**:
       - Analyze the sentiment of these *real* snippets.
       - Base the 'sponsorshipInsights' purely on the current public perception found in these search results.

    CRITICAL: You must return the result as a valid, raw JSON object matching the schema below. 
    Do not include any markdown formatting (like \`\`\`json). Just the raw JSON string.
    
    Required Schema:
    ${schemaDefinition}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        // Temperature 0 ensures deterministic output (consistent results for same query)
        temperature: 0,
        // We use googleSearch to get real data
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text;
    if (!text) throw new Error("No data returned from Gemini");

    // Clean up potential markdown code blocks if the model ignores instructions
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (text.startsWith('```')) {
        text = text.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const data = JSON.parse(text) as AnalysisResult;

    // Extract grounding sources (Real URLs)
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web)
      .map((web: any) => ({ title: web.title, uri: web.uri }));
    
    data.sources = sources || [];
    
    // Safety check for platform enum mapping
    if (data.posts) {
      data.posts = data.posts.map(p => {
        // Normalize platform string to match Enum if model gets creative
        let normalizedPlatform = p.platform as string;
        if (normalizedPlatform.toLowerCase().includes('youtube')) normalizedPlatform = 'YouTube';
        else if (normalizedPlatform.toLowerCase().includes('instagram')) normalizedPlatform = 'Instagram';
        else if (normalizedPlatform.toLowerCase().includes('reddit')) normalizedPlatform = 'Reddit';
        else if (normalizedPlatform.toLowerCase().includes('twitter') || normalizedPlatform.includes('X')) normalizedPlatform = 'Twitter';
        else if (normalizedPlatform.toLowerCase().includes('facebook')) normalizedPlatform = 'Facebook';
        else if (normalizedPlatform.toLowerCase().includes('quora')) normalizedPlatform = 'Quora';
        else normalizedPlatform = 'News';

        return {
          ...p,
          // @ts-ignore
          platform: normalizedPlatform as Platform,
          // @ts-ignore
          sentiment: p.sentiment as Sentiment
        };
      });
    }

    return data;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Return a fallback/empty state if API fails
    return {
      brandName,
      overallScore: 0,
      totalPosts: 0,
      sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
      posts: [],
      summary: "Failed to retrieve data. Please check API Key configuration.",
      sponsorshipInsights: {
        verdict: 'Caution',
        brandSafetyScore: 0,
        engagementRate: '0%',
        audienceDemographics: { ageGroup: 'N/A', genderSplit: 'N/A', topInterests: [] },
        riskFactors: ['Data Unavailable'],
        reachEstimation: 'N/A',
        brandValueImpact: 'N/A',
        followerGrowthPrediction: 'N/A',
        authenticityScore: 0,
        growthTrend: 'Stagnant',
        competitorSaturation: 'Low',
        pastCollaborations: []
      },
      sources: []
    };
  }
};