import React from 'react';
import { Sentiment } from '../../types';

interface BadgeProps {
  type: Sentiment | string;
}

export const Badge: React.FC<BadgeProps> = ({ type }) => {
  let colorClass = 'bg-gray-100 text-gray-800';

  switch (type) {
    case Sentiment.Positive:
      colorClass = 'bg-green-100 text-green-800 border border-green-200';
      break;
    case Sentiment.Negative:
      colorClass = 'bg-red-100 text-red-800 border border-red-200';
      break;
    case Sentiment.Neutral:
      colorClass = 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      break;
    case 'Twitter':
      colorClass = 'bg-sky-100 text-sky-800 border border-sky-200';
      break;
    case 'Facebook':
      colorClass = 'bg-blue-100 text-blue-800 border border-blue-200';
      break;
    case 'Reddit':
      colorClass = 'bg-orange-100 text-orange-800 border border-orange-200';
      break;
    case 'Quora':
      colorClass = 'bg-red-50 text-red-900 border border-red-200';
      break;
    case 'YouTube':
      colorClass = 'bg-red-100 text-red-800 border border-red-200';
      break;
    case 'Instagram':
      colorClass = 'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200';
      break;
    case 'News':
      colorClass = 'bg-gray-200 text-gray-700 border border-gray-300';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {type}
    </span>
  );
};