import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  labels: string[];
  data: number[];
}

const BarChart: React.FC<BarChartProps> = ({ labels, data }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Average Score',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: '#1e293b', // dark slate
        borderWidth: 3,
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
  return <Bar data={chartData} options={options} />;
};

export default BarChart;
