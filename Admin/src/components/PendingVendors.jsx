import { useState } from 'react';
import { format } from 'date-fns';

const PendingVendors = ({ vendors, onAction, onRefresh }) => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  const handleAction = async (action) => {
    if (!selectedVendor) return;
    
    setLoadingAction(true);
    try {
      await onAction(selectedVendor._id, action, actionNotes);
      setSelectedVendor(null);
      setActionNotes('');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setLoadingAction(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-success-100 text-success-800';
      case 'pending': return 'bg-warning-100 text-warning-800';
      case 'rejected': return 'bg-danger-100 text-danger-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (vendors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending vendors</h3>
        <p className="text-gray-500">All vendor registrations have been processed.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vendors.map((vendor) => (
              <tr key={vendor._id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {vendor.registrationData?.step1?.legalBusinessName || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      NPI: {vendor.registrationData?.step1?.npiNumber || 'N/A'}
                    </div>
                    {vendor.registrationData?.step1?.doingBusinessAs && (
                      <div className="text-sm text-gray-500">
                        DBA: {vendor.registrationData.step1.doingBusinessAs}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    {vendor.registrationData?.step2?.owner?.firstName} {vendor.registrationData?.step2?.owner?.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{vendor.email}</div>
                  <div className="text-sm text-gray-500">{vendor.registrationData?.step1?.phone}</div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {format(new Date(vendor.createdAt), 'MMM dd, yyyy')}
                  <div className="text-xs text-gray-400">
                    {format(new Date(vendor.createdAt), 'hh:mm a')}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vendor.verificationStatus)}`}>
                    {vendor.verificationStatus === 'pending' && '⏳ Pending'}
                    {vendor.verificationStatus === 'approved' && '✓ Approved'}
                    {vendor.verificationStatus === 'rejected' && '✗ Rejected'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedVendor(vendor)}
                      className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      Review
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Review Vendor</h3>
              <p className="text-sm text-gray-500 mt-1">
                {selectedVendor.registrationData?.step1?.legalBusinessName}
              </p>
            </div>
            
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">NPI Number</p>
                    <p className="text-sm text-gray-900">{selectedVendor.registrationData?.step1?.npiNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-sm text-gray-900">{selectedVendor.registrationData?.step1?.phone}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Business Address</p>
                  <p className="text-sm text-gray-900">
                    {selectedVendor.registrationData?.step1?.shippingAddress?.address1}
                    {selectedVendor.registrationData?.step1?.shippingAddress?.address2 && `, ${selectedVendor.registrationData.step1.shippingAddress.address2}`}
                    <br />
                    {selectedVendor.registrationData?.step1?.shippingAddress?.city}, 
                    {selectedVendor.registrationData?.step1?.shippingAddress?.state} 
                    {selectedVendor.registrationData?.step1?.shippingAddress?.zipCode}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Owner Information</p>
                  <p className="text-sm text-gray-900">
                    {selectedVendor.registrationData?.step2?.owner?.firstName} {selectedVendor.registrationData?.step2?.owner?.lastName}
                  </p>
                  <p className="text-sm text-gray-900">{selectedVendor.registrationData?.step2?.owner?.email}</p>
                  <p className="text-sm text-gray-900">{selectedVendor.registrationData?.step2?.owner?.mobile}</p>
                </div>

                <div>
                  <label className="label">Action Notes (Optional)</label>
                  <textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    rows="3"
                    className="input-field"
                    placeholder="Add notes about your decision..."
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setSelectedVendor(null);
                    setActionNotes('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={loadingAction}
                >
                  Cancel
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAction('reject')}
                    className="btn-danger px-4 py-2"
                    disabled={loadingAction}
                  >
                    {loadingAction ? 'Processing...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleAction('approve')}
                    className="btn-success px-4 py-2"
                    disabled={loadingAction}
                  >
                    {loadingAction ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PendingVendors;