import React from 'react';
import { Users, Briefcase, Award, TrendingUp, UserCheck, Clock, Calendar, BarChart2 } from 'lucide-react';

const HRProfile = () => {
  const statistics = [
    {
      title: "Total Employees",
      value: "2,547",
      change: "+12%",
      icon: <Users className="h-6 w-6" />,
      trend: "up"
    },
    {
      title: "Open Positions",
      value: "124",
      change: "+5%",
      icon: <Briefcase className="h-6 w-6" />,
      trend: "up"
    },
    {
      title: "Time to Hire",
      value: "23 days",
      change: "-15%",
      icon: <Clock className="h-6 w-6" />,
      trend: "down"
    },
    {
      title: "Retention Rate",
      value: "94%",
      change: "+2%",
      icon: <UserCheck className="h-6 w-6" />,
      trend: "up"
    }
  ];

  const detailedMetrics = [
    {
      category: "Recruitment",
      metrics: [
        { label: "Applications Received", value: "1,234" },
        { label: "Interviews Conducted", value: "342" },
        { label: "Offers Made", value: "89" },
        { label: "Offer Acceptance Rate", value: "76%" }
      ]
    },
    {
      category: "Employee Development",
      metrics: [
        { label: "Training Hours", value: "4,567" },
        { label: "Skill Certifications", value: "789" },
        { label: "Performance Reviews", value: "98%" },
        { label: "Promotion Rate", value: "12%" }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">HR Dashboard</h2>
        
        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  {stat.icon}
                </div>
                <span className={`text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1 dark:text-white">{stat.title}</h3>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {detailedMetrics.map((section, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">{section.category}</h3>
              <div className="space-y-4">
                {section.metrics.map((metric, mIndex) => (
                  <div key={mIndex} className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">{metric.label}</span>
                    <span className="font-semibold dark:text-white">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HRProfile;