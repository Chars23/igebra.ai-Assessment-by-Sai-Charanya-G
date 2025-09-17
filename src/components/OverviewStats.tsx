import React from 'react';

interface OverviewStatsProps {
  stats: {
    comprehension: number;
    attention: number;
    focus: number;
    retention: number;
    engagement_time: number;
    assessment_score: number;
  };
}

const OverviewStats: React.FC<OverviewStatsProps> = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
    {Object.entries(stats).map(([key, value]) => (
      <div key={key} className="bg-white rounded-xl shadow-card p-6 text-center border border-gray-200">
        <div className="text-black text-base font-semibold capitalize mb-1 tracking-wide">{key.replace('_', ' ')}</div>
        <div className="text-3xl font-extrabold text-black drop-shadow">{value.toFixed(2)}</div>
      </div>
    ))}
  </div>
);

export default OverviewStats;
