import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../services/api.js';
import DashboardStats from '../components/DashboardStats.jsx';
import PendingVendors from '../components/PendingVendors.jsx';
import RecentActivities from '../components/RecentActivities.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes, activitiesRes] = await Promise.all([
        API.getDashboardStats(),
        API.getPendingVendors(),
        API.getRecentActivities(10)
      ]);
      
      setStats(statsRes);
      setPendingVendors(pendingRes);
      setRecentActivities(activitiesRes);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorAction = async (vendorId, action, notes = '') => {
    try {
      if (action === 'approve' || action === 'reject') {
        await API.verifyVendor(vendorId, action === 'approve' ? 'approved' : 'rejected', notes);
      }
      fetchDashboardData();
    } catch (error) {
      console.error('Error performing action:', error);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="page-header">
        <h1 className="page-title">Welcome back, Administrator!</h1>
        <p className="page-subtitle">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/vendors"
          className="card hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Manage Vendors</h3>
              <p className="text-sm text-gray-500">View and manage all registered pharmacies</p>
            </div>
          </div>
        </Link>

        <div className="card hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-success-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Document Review</h3>
              <p className="text-sm text-gray-500">Review uploaded vendor documents</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-warning-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Pending Approvals</h3>
              <p className="text-sm text-gray-500">{pendingVendors.length} vendors awaiting verification</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Vendors */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Pending Vendor Approvals</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning-100 text-warning-800">
              {pendingVendors.length} pending
            </span>
          </div>
          <PendingVendors 
            vendors={pendingVendors} 
            onAction={handleVendorAction}
            onRefresh={fetchDashboardData}
          />
        </div>

        {/* Recent Activities */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activities</h2>
          <RecentActivities activities={recentActivities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;