import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import RegistrationStatus from '../../components/Profile/RegistrationStatus.jsx';
import CompleteProfileInfo from '../../components/Profile/CompleteProfileInfo.jsx';
import DocumentsUpload from '../../components/Profile/DocumentsUpload.jsx';
import AccountSettings from '../../components/Profile/AccountSettings.jsx';
import { API_URL } from '../../components/OtherContent/BaseURL.jsx';

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const { user, fetchWithAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview';
    setActiveTab(tab);
    fetchProfileData();
  }, [searchParams]);

  const fetchProfileData = async () => {
    try {
      const data = await fetchWithAuth(`${API_URL}/auth/me`);
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'complete-profile', name: 'Complete Profile', icon: '📋' },
    { id: 'documents', name: 'Upload Documents', icon: '📄' },
    { id: 'account', name: 'Account Settings', icon: '⚙️' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleUpdateProfile = async (updatedData) => {
    setLoading(true);
    try {
      await fetchWithAuth(`${API_URL}/auth/profile`, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      });
      await fetchProfileData();
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/upload-documents-profile`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      const data = await response.json();
      await fetchProfileData();
      alert('Documents uploaded successfully!');
      return data;
    } catch (error) {
      alert('Error uploading documents: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    if (!profileData) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <RegistrationStatus />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Info Card */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Business Name</p>
                    <p className="font-medium text-gray-900">
                      {profileData.registrationData?.step1?.legalBusinessName || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Email</p>
                    <p className="font-medium text-gray-900">{profileData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">
                      {profileData.registrationData?.step1?.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration Progress */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Registration Progress</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Basic Information', step: 'step1', icon: '✅' },
                    { label: 'Owner Information', step: 'step2', icon: '✅' },
                    { label: 'Contact Information', step: 'step3', icon: '✅' },
                    { label: 'Licenses', step: 'step4', icon: '✅' },
                    { label: 'Pharmacy Details', step: 'step5', icon: '✅' },
                    { label: 'Referral Information', step: 'step6', icon: '✅' },
                    { label: 'Documents Uploaded', completed: profileData.documentsUploaded, icon: '📄' },
                    { label: 'Profile Completed', completed: profileData.registrationCompleted, icon: '🏢' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <span className="mr-3 text-xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{item.label}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: item.step 
                              ? (profileData.registrationData?.[item.step] ? '100%' : '0%')
                              : (item.completed ? '100%' : '0%')
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Card */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <ActivityItem 
                    label="Account Created" 
                    value={profileData.createdAt} 
                  />
                  <ActivityItem 
                    label="Last Login" 
                    value={profileData.lastLogin} 
                  />
                  <ActivityItem 
                    label="Login Count" 
                    value={profileData.loginCount} 
                    isCount={true}
                  />
                  <ActivityItem 
                    label="Documents Uploaded" 
                    value={profileData.documents?.uploadedAt} 
                  />
                  <ActivityItem 
                    label="Profile Updated" 
                    value={profileData.profile?.updatedAt} 
                  />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleTabChange('complete-profile')}
                  className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl mr-3">📋</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">View Complete Profile</p>
                    <p className="text-sm text-gray-500">See all registration details</p>
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange('documents')}
                  className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl mr-3">📄</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Upload Documents</p>
                    <p className="text-sm text-gray-500">Submit required files</p>
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange('account')}
                  className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl mr-3">⚙️</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Account Settings</p>
                    <p className="text-sm text-gray-500">Update email/password</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      case 'complete-profile':
        return <CompleteProfileInfo profile={profileData} />;
      
      case 'documents':
        return <DocumentsUpload profile={profileData} onUpdate={handleUpdateProfile} loading={loading} />;
      
      case 'account':
        return <AccountSettings profile={profileData} onUpdate={handleUpdateProfile} loading={loading} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {profileData?.registrationData?.step1?.legalBusinessName || profileData?.email}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              profileData?.verificationStatus === 'approved' 
                ? 'bg-green-100 text-green-800'
                : profileData?.verificationStatus === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${
                profileData?.verificationStatus === 'approved' 
                  ? 'bg-green-500'
                  : profileData?.verificationStatus === 'rejected'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
              }`}></span>
              Status: {profileData?.verificationStatus?.toUpperCase() || 'PENDING'}
            </div>
            <button
              onClick={fetchProfileData}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs and Content */}
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
                <span className="mr-2 text-lg">{tab.icon}</span>
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

// Helper component for activity items
const ActivityItem = ({ label, value, isCount = false }) => {
  const getDisplayValue = () => {
    if (isCount) return value || 0;
    if (!value) return 'N/A';
    return new Date(value).toLocaleString();
  };

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-medium ${isCount ? 'text-blue-600' : 'text-gray-900'}`}>
        {getDisplayValue()}
      </span>
    </div>
  );
};

export default Profile;