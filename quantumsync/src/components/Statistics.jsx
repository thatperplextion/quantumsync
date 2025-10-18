import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Statistics({ history, statsData, theme }) {
  // Process history data for the chart
  const fileTypes = history.reduce((acc, curr) => {
    acc[curr.fileType] = (acc[curr.fileType] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(fileTypes),
    datasets: [
      {
        data: Object.values(fileTypes),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#fff' : '#1e293b',
          font: {
            family: 'system-ui',
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 md:grid-cols-1 gap-4 md:col-span-2">
        {[
          { label: 'Total Files', value: statsData.total },
          { label: 'Average Time', value: `${statsData.avgTime}ms` },
          { label: 'Success Rate', value: `${statsData.successRate}%` },
        ].map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl backdrop-blur-xl ${
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700/50'
                : 'bg-white/50 border-slate-200/50'
            } border`}
          >
            <h3 className="text-slate-400 text-sm font-medium mb-2">
              {stat.label}
            </h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div
        className={`p-6 rounded-2xl backdrop-blur-xl ${
          theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700/50'
            : 'bg-white/50 border-slate-200/50'
        } border`}
      >
        <h3 className="text-slate-400 text-sm font-medium mb-4">File Types</h3>
        <div className="aspect-square">
          <Doughnut data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}