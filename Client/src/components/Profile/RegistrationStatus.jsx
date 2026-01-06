import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const RegistrationStatus = () => {
  const [status, setStatus] = useState(null);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    fetchRegistrationStatus();
  }, []);

  const fetchRegistrationStatus = async () => {
    try {
      const data = await fetchWithAuth('/api/auth/registration-status');
      setStatus(data);
    } catch (error) {
      console.error('Error fetching registration status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!status) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Registration Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Account Status</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status.verificationStatus)}`}>
                {status.verificationStatus?.toUpperCase() || 'PENDING'}
              </span>
              <span className="text-sm text-gray-600">
                {status.isVerified ? '✓ Verified' : '⏳ Pending Verification'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Registration Completion</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${status.registrationCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm text-gray-800">
                {status.registrationCompleted ? 'Completed' : 'Incomplete'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Documents</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${status.documentsUploaded ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm text-gray-800">
                {status.documentsUploaded ? 'All documents uploaded' : 'Documents pending'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">User Role</h3>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {status.role?.toUpperCase() || 'VENDOR'}
            </span>
          </div>
        </div>
      </div>

      {status.verificationStatus === 'pending' && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your account is pending verification. Please ensure all documents are uploaded and complete.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationStatus;