import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart, LinearScale, PointElement, Tooltip, Legend, Title } from 'chart.js';

Chart.register(LinearScale, PointElement, Tooltip, Legend, Title);

interface ScatterPlotProps {
  data: { x: number; y: number }[];
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
  const chartData = {
    datasets: [
      {
        label: 'Attention vs Assessment Score',
        data,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: '#1e293b',
        borderWidth: 2,
        pointBorderColor: '#1e293b',
        pointBackgroundColor: '#1e293b',
      },
    ],
  };
  const options = {
    scales: {
      x: {
        grid: { color: '#1e293b', borderColor: '#1e293b', borderWidth: 2 },
        ticks: { color: '#1e293b' },
      },
      y: {
        grid: { color: '#1e293b', borderColor: '#1e293b', borderWidth: 2 },
        ticks: { color: '#1e293b' },
      },
    },
    plugins: {
      legend: { labels: { color: '#1e293b' } },
    },
  };
  return <Scatter data={chartData} options={options} />;
};

export default ScatterPlot;
