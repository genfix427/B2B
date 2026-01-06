const DashboardStats = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Vendors',
      value: stats.totalVendors,
      icon: '👥',
      color: 'primary',
      change: '+12%',
      description: 'Registered pharmacies'
    },
    {
      title: 'Pending Verification',
      value: stats.pendingVendors,
      icon: '⏳',
      color: 'warning',
      change: '+5',
      description: 'Awaiting approval'
    },
    {
      title: 'Active Vendors',
      value: stats.activeVendors,
      icon: '✅',
      color: 'success',
      change: '+8%',
      description: 'Verified and active'
    },
    {
      title: 'New Today',
      value: stats.newRegistrationsToday,
      icon: '🆕',
      color: 'secondary',
      change: '+3',
      description: 'Registered today'
    },
    {
      title: 'Pending Documents',
      value: stats.pendingDocuments,
      icon: '📄',
      color: 'warning',
      change: '+7',
      description: 'Documents to review'
    },
    {
      title: 'Suspended',
      value: stats.suspendedVendors,
      icon: '⏸️',
      color: 'danger',
      change: '-2',
      description: 'Temporarily suspended'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary': return 'bg-primary-100 text-primary-600';
      case 'success': return 'bg-success-100 text-success-600';
      case 'warning': return 'bg-warning-100 text-warning-600';
      case 'secondary': return 'bg-secondary-100 text-secondary-600';
      case 'danger': return 'bg-danger-100 text-danger-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="card hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-xs font-medium ${
                  stat.change.startsWith('+') ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500 ml-2">from yesterday</span>
              </div>
            </div>
            <div className={`h-12 w-12 rounded-xl ${getColorClasses(stat.color)} flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">{stat.description}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;