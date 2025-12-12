import React, { useState, useCallback } from 'react';
import { Search, Loader2, Activity } from 'lucide-react';
import { AnalysisResult, ScraperLog } from './types';
import { analyzeBrand } from './services/geminiService';
import { TerminalLogs } from './components/TerminalLogs';
import { AnalysisDashboard } from './components/AnalysisDashboard';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [logs, setLogs] = useState<ScraperLog[]>([]);

  // Logger function
  const addLog = (thread: string, message: string, status: ScraperLog['status'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      thread,
      message,
      status
    }]);
  };

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setData(null);
    setLogs([]);

    // 1. Initiate Real-time Search
    addLog('System', 'Initializing Search Agent...', 'info');
    
    // Honest feedback about the AI process
    setTimeout(() => addLog('Google Search', 'Querying live index for YouTube, Reddit, Instagram...', 'info'), 500);
    setTimeout(() => addLog('Google Search', 'Filtering results for recent discussions...', 'info'), 1200);

    try {
      // 2. Call Gemini with Search Grounding
      const analysisPromise = analyzeBrand(query);
      
      setTimeout(() => addLog('Analysis', 'Extracting snippets from search results...', 'info'), 2500);
      setTimeout(() => addLog('Analysis', 'Evaluating sentiment and engagement...', 'warning'), 3500);
      
      const result = await analysisPromise;

      // 3. Complete
      addLog('System', 'Live data retrieval complete.', 'success');
      addLog('System', `Found ${result.sources?.length || 0} verified sources.`, 'success');
      addLog('System', 'Aggregating final report...', 'info');

      setTimeout(() => {
        setData(result);
        setIsAnalyzing(false);
      }, 800); 

    } catch (error) {
      addLog('System', 'Critical Error during analysis', 'error');
      setIsAnalyzing(false);
    }
  }, [query, isAnalyzing]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">BrandPulse AI</h1>
          </div>
          <div className="text-sm text-gray-500 hidden md:block">
            Sponsorship Intelligence & Sentiment Analysis
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Section */}
        <div className={`transition-all duration-500 ease-in-out ${data ? 'mb-8' : 'min-h-[60vh] flex flex-col justify-center'}`}>
          
          {!data && !isAnalyzing && (
            <div className="text-center mb-10 space-y-4">
              <h2 className="text-4xl font-extrabold text-gray-900">
                Influencer & Brand Audit
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real-time sentiment analysis using live Google Search data.
                Enter an influencer or brand name to scrape YouTube, Reddit, and Instagram mentions.
              </p>
            </div>
          )}

          <div className="max-w-2xl mx-auto w-full">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`h-6 w-6 ${isAnalyzing ? 'text-brand-500' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all text-lg shadow-sm"
                placeholder="Enter influencer name (e.g. MrBeast, MKBHD) or Brand..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isAnalyzing}
              />
              <button
                type="submit"
                disabled={isAnalyzing || !query.trim()}
                className="absolute right-2 top-2 bottom-2 bg-brand-600 text-white px-6 rounded-xl font-medium hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Analyze Fit'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Terminal / Status Logs */}
        <TerminalLogs logs={logs} visible={isAnalyzing || logs.length > 0} />

        {/* Results Dashboard */}
        {data && <AnalysisDashboard data={data} />}
        
      </main>
    </div>
  );
};

export default App;