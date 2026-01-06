import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ProfileInfo from '../components/profile/ProfileInfo.jsx';
import DocumentsUpload from '../components/profile/DocumentsUpload.jsx';
import AccountSettings from '../components/profile/AccountSettings.jsx';
import BusinessInfo from '../components/profile/BusinessInfo.jsx';

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');
  const { user, fetchWithAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Get tab from URL params
    const tab = searchParams.get('tab') || 'profile';
    setActiveTab(tab);
    fetchProfileData();
  }, [searchParams]);

  const fetchProfileData = async () => {
    try {
      const data = await fetchWithAuth('/api/auth/me');
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile Info', icon: '👤' },
    { id: 'business', name: 'Business Info', icon: '🏢' },
    { id: 'documents', name: 'Documents', icon: '📄' },
    { id: 'account', name: 'Account Settings', icon: '⚙️' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleUpdateProfile = async (updatedData) => {
    setLoading(true);
    try {
      await fetchWithAuth('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      });
      await fetchProfileData();
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    if (!profileData) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return <ProfileInfo profile={profileData} onUpdate={handleUpdateProfile} loading={loading} />;
      case 'business':
        return <BusinessInfo profile={profileData} onUpdate={handleUpdateProfile} loading={loading} />;
      case 'documents':
        return <DocumentsUpload profile={profileData} onUpdate={handleUpdateProfile} loading={loading} />;
      case 'account':
        return <AccountSettings profile={profileData} onUpdate={handleUpdateProfile} loading={loading} />;
      default:
        return <ProfileInfo profile={profileData} onUpdate={handleUpdateProfile} loading={loading} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account information and settings
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;