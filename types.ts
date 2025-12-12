export enum Platform {
  Twitter = 'Twitter',
  Facebook = 'Facebook',
  Reddit = 'Reddit',
  Quora = 'Quora',
  YouTube = 'YouTube',
  Instagram = 'Instagram',
  News = 'News',
}

export enum Sentiment {
  Positive = 'Positive',
  Negative = 'Negative',
  Neutral = 'Neutral',
}

export interface Post {
  id: string;
  content: string;
  platform: Platform;
  sentiment: Sentiment;
  author: string;
  timestamp: string;
  likes: number;
}

export interface SponsorshipInsights {
  verdict: 'Highly Recommended' | 'Recommended' | 'Caution' | 'Not Recommended';
  brandSafetyScore: number; // 0 to 100
  engagementRate: string;
  audienceDemographics: {
    ageGroup: string;
    genderSplit: string;
    topInterests: string[];
  };
  riskFactors: string[];
  // Predictive ROI Metrics
  reachEstimation: string;
  brandValueImpact: string;
  followerGrowthPrediction: string;
  // New: Strategic Fit & Authenticity
  authenticityScore: number; // 0-100 (Bot detection)
  growthTrend: 'Explosive' | 'Steady' | 'Stagnant' | 'Declining';
  competitorSaturation: 'High' | 'Medium' | 'Low'; 
  pastCollaborations: string[];
}

export interface AnalysisResult {
  brandName: string;
  overallScore: number; // 0 to 100
  totalPosts: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  posts: Post[];
  summary: string;
  sponsorshipInsights: SponsorshipInsights;
  sources?: { title: string; uri: string }[];
}

export interface ScraperLog {
  id: string;
  timestamp: string;
  thread: string;
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
}