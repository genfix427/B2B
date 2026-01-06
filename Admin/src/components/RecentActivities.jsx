import { format } from 'date-fns';

const RecentActivities = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'registration':
        return (
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        );
      case 'approval':
        return (
          <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'rejection':
        return (
          <div className="h-8 w-8 rounded-full bg-danger-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-success-600 bg-success-50';
      case 'pending': return 'text-warning-600 bg-warning-50';
      case 'rejected': return 'text-danger-600 bg-danger-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No recent activities</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.slice(0, 5).map((activity, index) => (
        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          {getActivityIcon(activity.type)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {activity.vendorName}
              </p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(activity.status)}`}>
                {activity.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {activity.action} • {format(new Date(activity.timestamp), 'MMM dd, hh:mm a')}
            </p>
          </div>
        </div>
      ))}
      
      {activities.length > 5 && (
        <div className="text-center pt-2">
          <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
            View all activities →
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;