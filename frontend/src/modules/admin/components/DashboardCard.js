import React from 'react';

const DashboardCard = ({ title, value, icon, color = 'blue', description }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50',
    yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
    red: 'bg-red-500 text-red-600 bg-red-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50',
  };

  const [bgClass, textClass, cardBgClass] = colorClasses[color].split(' ');

  return (
    <div className={`${cardBgClass} rounded-lg p-6 shadow-sm border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`${bgClass} p-3 rounded-lg`}>
          <div className={`${textClass} w-6 h-6`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;