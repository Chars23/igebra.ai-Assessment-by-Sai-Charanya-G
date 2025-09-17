import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarChartProps {
  labels: string[];
  data: number[];
}

const RadarChart: React.FC<RadarChartProps> = ({ labels, data }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Student Profile',
        data,
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        borderColor: '#1e293b',
        borderWidth: 3,
        pointBackgroundColor: '#1e293b',
        pointBorderColor: '#1e293b',
      },
    ],
  };
  const options = {
    scales: {
      r: {
        angleLines: { color: '#1e293b' },
        grid: { color: '#1e293b' },
        pointLabels: { color: '#1e293b' },
        ticks: { color: '#1e293b' },
      },
    },
    plugins: {
      legend: { labels: { color: '#1e293b' } },
    },
  };
  return <Radar data={chartData} options={options} />;
};

export default RadarChart;
