import React, { useEffect, useRef } from 'react';
import { ScraperLog } from '../types';
import { Terminal } from 'lucide-react';

interface TerminalLogsProps {
  logs: ScraperLog[];
  visible: boolean;
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({ logs, visible }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, visible]);

  if (!visible) return null;

  return (
    <div className="w-full bg-dark-900 rounded-lg shadow-xl overflow-hidden border border-gray-700 font-mono text-sm my-6">
      <div className="bg-dark-800 px-4 py-2 border-b border-gray-700 flex items-center gap-2">
        <Terminal className="w-4 h-4 text-green-400" />
        <span className="text-gray-300 font-semibold">Scraper Process Monitor (Multi-Threaded)</span>
      </div>
      <div className="p-4 h-64 overflow-y-auto bg-black/90">
        {logs.map((log) => (
          <div key={log.id} className="mb-1 flex">
            <span className="text-gray-500 mr-2">[{log.timestamp}]</span>
            <span className={`mr-2 w-24 ${
              log.thread.includes('Twitter') ? 'text-sky-400' :
              log.thread.includes('Facebook') ? 'text-blue-500' :
              log.thread.includes('Reddit') ? 'text-orange-500' :
              log.thread.includes('Quora') ? 'text-red-400' :
              'text-purple-400'
            }`}>
              {log.thread}
            </span>
            <span className={`${
              log.status === 'success' ? 'text-green-400' :
              log.status === 'warning' ? 'text-yellow-400' :
              log.status === 'error' ? 'text-red-500' :
              'text-gray-300'
            }`}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};