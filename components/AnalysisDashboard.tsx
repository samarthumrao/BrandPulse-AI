import React from 'react';
import { AnalysisResult, Sentiment } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { Badge } from './ui/Badge';
import { ThumbsUp, ThumbsDown, Minus, TrendingUp, AlertCircle, ShieldCheck, ShieldAlert, Users, Target, Megaphone, DollarSign, ArrowUpRight, CheckCircle, Activity, Briefcase, Link as LinkIcon, ExternalLink } from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisResult;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  const pieData = [
    { name: 'Positive', value: data.sentimentDistribution.positive, color: '#22c55e' }, // green-500
    { name: 'Neutral', value: data.sentimentDistribution.neutral, color: '#eab308' },  // yellow-500
    { name: 'Negative', value: data.sentimentDistribution.negative, color: '#ef4444' }, // red-500
  ];

  // Calculate stats for ComposedChart (Volume + Sentiment Trend)
  const platformStats = data.posts.reduce((acc, post) => {
    const key = post.platform;
    if (!acc[key]) {
      acc[key] = { count: 0, scoreSum: 0 };
    }
    acc[key].count += 1;
    
    // Scoring: Positive = 100, Neutral = 50, Negative = 0
    let score = 50;
    if (post.sentiment === Sentiment.Positive) score = 100;
    if (post.sentiment === Sentiment.Negative) score = 0;
    
    acc[key].scoreSum += score;
    return acc;
  }, {} as Record<string, { count: number; scoreSum: number }>);

  const mixedChartData = Object.keys(platformStats).map(key => ({
    name: key,
    posts: platformStats[key].count,
    sentiment: Math.round(platformStats[key].scoreSum / platformStats[key].count),
  }));

  const { sponsorshipInsights } = data;
  
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Highly Recommended': return 'bg-green-600 text-white';
      case 'Recommended': return 'bg-blue-600 text-white';
      case 'Caution': return 'bg-yellow-500 text-white';
      case 'Not Recommended': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSafetyColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }}></div>
            <p className="font-semibold text-gray-800">{payload[0].name}</p>
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-bold">{payload[0].value}</span> posts
          </p>
          <p className="text-xs text-gray-400">
            {((payload[0].value / (data.totalPosts || 1)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomMixedTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg z-10">
          <p className="font-bold text-gray-800 mb-2 border-b border-gray-100 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm mb-1">
               <div className="w-2 h-2" style={{ backgroundColor: entry.color }}></div>
               <span className="text-gray-600">{entry.name === 'posts' ? 'Volume' : 'Sentiment Score'}:</span>
               <span className="font-bold text-gray-900">{entry.value}{entry.name === 'sentiment' ? '/100' : ''}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* 1. Sponsorship Intelligence Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {data.brandName} 
                <span className="text-gray-400 font-normal text-lg">| Sponsorship Intelligence</span>
              </h2>
              <p className="text-gray-500 text-sm mt-1">AI-Driven Audit for Brand Partnerships</p>
            </div>
            <div className={`px-6 py-2 rounded-full font-bold text-lg shadow-sm ${getVerdictColor(sponsorshipInsights.verdict)}`}>
              Verdict: {sponsorshipInsights.verdict}
            </div>
          </div>
        </div>

        {/* 1.1 Projected Campaign Impact */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-gray-50 border-b border-gray-200">
           <div className="p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Est. Campaign Reach</p>
                <p className="text-xl font-bold text-gray-900">{sponsorshipInsights.reachEstimation}</p>
              </div>
           </div>
           <div className="p-6 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg text-green-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Brand Value Impact</p>
                <p className="text-xl font-bold text-gray-900">{sponsorshipInsights.brandValueImpact}</p>
              </div>
           </div>
           <div className="p-6 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Follower Increase</p>
                <p className="text-xl font-bold text-gray-900">{sponsorshipInsights.followerGrowthPrediction}</p>
              </div>
           </div>
        </div>

        {/* 1.2 Authenticity & Competition */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-b border-gray-100">
            {/* Authenticity Check */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-teal-600" />
                        <h3 className="font-semibold text-gray-700">Audience Authenticity</h3>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${sponsorshipInsights.authenticityScore > 80 ? 'bg-teal-100 text-teal-800' : 'bg-orange-100 text-orange-800'}`}>
                        {sponsorshipInsights.authenticityScore}% Real
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden relative">
                     <div 
                        className={`h-full transition-all duration-1000 flex items-center justify-end pr-2 text-[10px] text-white font-bold ${sponsorshipInsights.authenticityScore > 80 ? 'bg-teal-500' : sponsorshipInsights.authenticityScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${sponsorshipInsights.authenticityScore}%` }}
                    >
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {sponsorshipInsights.authenticityScore > 85 ? "High quality audience. Minimal bot activity detected." : "Warning: Significant suspicious activity or bot followers detected."}
                </p>
            </div>

            {/* Competitor & Growth */}
            <div className="p-6">
                 <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-gray-700">Market Position</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-xs text-gray-400 uppercase font-bold">Growth Trend</span>
                        <div className="flex items-center gap-1 text-gray-900 font-medium">
                            <Activity className="w-4 h-4 text-brand-500" />
                            {sponsorshipInsights.growthTrend}
                        </div>
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 uppercase font-bold">Ad Saturation</span>
                        <div className="text-gray-900 font-medium">
                            {sponsorshipInsights.competitorSaturation}
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Recent Collaborations</span>
                    <div className="flex flex-wrap gap-2">
                        {sponsorshipInsights.pastCollaborations.map((brand, i) => (
                            <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded border border-indigo-100">
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          {/* Brand Safety */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              {sponsorshipInsights.brandSafetyScore > 70 ? (
                <ShieldCheck className="w-5 h-5 text-green-500" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-red-500" />
              )}
              <h3 className="font-semibold text-gray-700">Brand Safety Score</h3>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className={`text-4xl font-bold ${getSafetyColor(sponsorshipInsights.brandSafetyScore)}`}>
                {sponsorshipInsights.brandSafetyScore}
              </span>
              <span className="text-gray-400 mb-1">/ 100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${sponsorshipInsights.brandSafetyScore > 70 ? 'bg-green-500' : sponsorshipInsights.brandSafetyScore > 40 ? 'bg-yellow-400' : 'bg-red-500'}`} 
                style={{ width: `${sponsorshipInsights.brandSafetyScore}%` }}
              ></div>
            </div>
            {sponsorshipInsights.riskFactors.length > 0 ? (
               <div className="mt-4 bg-red-50 p-3 rounded-lg border border-red-100">
                 <p className="text-xs font-bold text-red-800 uppercase mb-1">Risk Factors Detected</p>
                 <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
                   {sponsorshipInsights.riskFactors.map((risk, i) => (
                     <li key={i}>{risk}</li>
                   ))}
                 </ul>
               </div>
            ) : (
              <p className="text-xs text-green-600 mt-4 bg-green-50 p-2 rounded border border-green-100">No major controversies detected.</p>
            )}
          </div>

          {/* Engagement & Sentiment */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-700">Performance Metrics</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500">Avg. Engagement</span>
                <span className="font-bold text-gray-900">{sponsorshipInsights.engagementRate}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500">Sentiment Score</span>
                <span className="font-bold text-gray-900">{data.overallScore}/100</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500">Total Mentions</span>
                <span className="font-bold text-gray-900">{data.totalPosts}</span>
              </div>
            </div>
          </div>

          {/* Audience Demographics */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-gray-700">Target Audience</h3>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-400 uppercase font-bold">Core Age Group</span>
                <p className="text-lg font-medium text-gray-900">{sponsorshipInsights.audienceDemographics.ageGroup}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase font-bold">Gender Split</span>
                <p className="text-sm font-medium text-gray-700">{sponsorshipInsights.audienceDemographics.genderSplit}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase font-bold">Top Interests</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {sponsorshipInsights.audienceDemographics.topInterests.map((interest, i) => (
                    <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md border border-purple-100">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI Summary Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-brand-500" />
            <h3 className="text-lg font-semibold text-gray-800">Strategic Executive Summary</h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed border-l-4 border-brand-500 pl-4">{data.summary}</p>
      </div>
      
      {/* 3. Data Sources */}
      {data.sources && data.sources.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <LinkIcon className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Verified Data Sources</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">The AI analysis is grounded in the following real-time web results:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group border border-gray-100"
                >
                  <span className="text-sm text-gray-700 truncate pr-4">{source.title}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-brand-500 flex-shrink-0" />
                </a>
              ))}
            </div>
        </div>
      )}

      {/* 4. Detailed Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sentiment Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sentiment Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-sm text-gray-600">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Volume & Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Volume & Sentiment Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mixedChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#0ea5e9" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#f59e0b" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomMixedTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="posts" name="Volume" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="sentiment" name="Sentiment Score" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Live Feed */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Scraped Feed</h3>
          <span className="text-xs text-gray-500 font-mono">Live Data</span>
        </div>
        <div className="divide-y divide-gray-100">
          {data.posts.map((post, idx) => (
            <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Badge type={post.platform} />
                  <span className="text-xs text-gray-400">@{post.author} • {post.timestamp}</span>
                </div>
                <Badge type={post.sentiment} />
              </div>
              <p className="text-gray-800 text-sm mb-3">{post.content}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  {post.sentiment === Sentiment.Positive ? <ThumbsUp className="w-3 h-3" /> : 
                   post.sentiment === Sentiment.Negative ? <ThumbsDown className="w-3 h-3" /> : 
                   <Minus className="w-3 h-3" />}
                   {post.likes} engagement
                </span>
                {post.sentiment === Sentiment.Negative && (
                   <span className="flex items-center gap-1 text-red-400">
                     <AlertCircle className="w-3 h-3" /> flagged
                   </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};