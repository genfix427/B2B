import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import StatsCards from '../../components/admin/StatsCards.jsx';
import PendingVendorsTable from '../../components/admin/PendingVendorsTable.jsx';
import RecentActivities from '../../components/admin/RecentActivities.jsx';
import VendorManagement from '../../components/admin/VendorManagement.jsx';

const AdminDashboard = () => {
  const { fetchWithAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes, activitiesRes] = await Promise.all([
        fetchWithAuth('/api/admin/dashboard/stats'),
        fetchWithAuth('/api/admin/vendors/pending'),
        fetchWithAuth('/api/admin/activities?limit=10')
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
        await fetchWithAuth(`/api/admin/vendors/${vendorId}/verify`, {
          method: 'PUT',
          body: JSON.stringify({
            verificationStatus: action === 'approve' ? 'approved' : 'rejected',
            verificationNotes: notes
          })
        });
      } else if (action === 'suspend' || action === 'activate') {
        await fetchWithAuth(`/api/admin/vendors/${vendorId}/status`, {
          method: 'PUT',
          body: JSON.stringify({
            status: action === 'suspend' ? 'suspended' : 'active',
            notes
          })
        });
      }
      
      alert(`Vendor ${action}d successfully`);
      fetchDashboardData();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDocumentReview = async (vendorId, status, notes = '') => {
    try {
      await fetchWithAuth(`/api/admin/vendors/${vendorId}/documents`, {
        method: 'PUT',
        body: JSON.stringify({
          status,
          reviewNotes: notes
        })
      });
      
      alert(`Documents ${status} successfully`);
      fetchDashboardData();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'vendors', name: 'Vendor Management' },
    { id: 'pending', name: 'Pending Approvals' },
    { id: 'documents', name: 'Document Review' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage vendors and platform operations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              {tab.id === 'pending' && stats?.pendingVendors > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {stats.pendingVendors}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <StatsCards stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PendingVendorsTable 
                vendors={pendingVendors} 
                onAction={handleVendorAction}
              />
              
              <RecentActivities activities={recentActivities} />
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <VendorManagement 
            onAction={handleVendorAction}
            onDocumentReview={handleDocumentReview}
          />
        )}

        {activeTab === 'pending' && (
          <div className="bg-white rounded-xl shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Pending Vendor Approvals</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {pendingVendors.length} pending
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">Review and verify new vendor registrations</p>
            </div>
            <PendingVendorsTable 
              vendors={pendingVendors} 
              onAction={handleVendorAction}
              showDetails={true}
            />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Document Review</h2>
              <p className="text-gray-600 text-sm mt-1">Review uploaded vendor documents</p>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-center py-12">
                Document review interface will be implemented in the next phase.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;