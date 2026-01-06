import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const VendorList = ({ 
  vendors, 
  pagination, 
  filters, 
  onFilterChange, 
  onPageChange, 
  onVendorSelect,
  onAction 
}) => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const navigate = useNavigate();

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newFilters = {
      status: formData.get('status'),
      search: formData.get('search')
    };
    onFilterChange(newFilters);
  };

  const handleAction = async (action) => {
    if (!selectedVendor) return;
    
    try {
      await onAction(selectedVendor._id, action, actionNotes);
      setSelectedVendor(null);
      setActionNotes('');
    } catch (error) {
      console.error('Action failed:', error);
      alert(`Action failed: ${error.message}`);
    }
  };

  const handleViewVendor = (vendor) => {
    if (onVendorSelect) {
      onVendorSelect(vendor);
    } else {
      navigate(`/vendors/${vendor._id}`);
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

  const getAccountStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-800';
      case 'suspended': return 'bg-danger-100 text-danger-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Vendor Management</h1>
        <p className="page-subtitle">Manage all registered pharmacies and their accounts</p>
      </div>

      {/* Filters */}
      <div className="card">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Status</label>
            <select
              name="status"
              defaultValue={filters.status}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="label">Search</label>
            <input
              type="text"
              name="search"
              defaultValue={filters.search}
              className="input-field"
              placeholder="Search by name, NPI, or email..."
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full">
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
          <p className="text-sm text-gray-500">Total Vendors</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-gray-900">
            {vendors.filter(v => v.verificationStatus === 'pending').length}
          </p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-gray-900">
            {vendors.filter(v => v.verificationStatus === 'approved').length}
          </p>
          <p className="text-sm text-gray-500">Approved</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-gray-900">
            {vendors.filter(v => v.verificationStatus === 'rejected').length}
          </p>
          <p className="text-sm text-gray-500">Rejected</p>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
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
                      <div className="text-xs text-gray-400">
                        Joined: {format(new Date(vendor.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {vendor.registrationData?.step2?.owner?.firstName} {vendor.registrationData?.step2?.owner?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{vendor.email}</div>
                    <div className="text-sm text-gray-500">{vendor.registrationData?.step1?.phone}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vendor.verificationStatus)}`}>
                        {vendor.verificationStatus}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountStatusColor(vendor.status)}`}>
                        {vendor.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vendor.documentsUploaded 
                        ? vendor.documents?.status === 'approved' 
                          ? 'bg-success-100 text-success-800'
                          : vendor.documents?.status === 'rejected'
                          ? 'bg-danger-100 text-danger-800'
                          : 'bg-warning-100 text-warning-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vendor.documentsUploaded 
                        ? vendor.documents?.status || 'uploaded'
                        : 'missing'
                      }
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewVendor(vendor)}
                        className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                      >
                        View
                      </button>
                      {vendor.verificationStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedVendor(vendor);
                              setActionNotes('');
                            }}
                            className="text-success-600 hover:text-success-900 text-sm font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedVendor(vendor);
                              setActionNotes('');
                            }}
                            className="text-danger-600 hover:text-danger-900 text-sm font-medium"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {vendor.verificationStatus === 'approved' && vendor.status === 'active' && (
                        <button
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setActionNotes('');
                          }}
                          className="text-warning-600 hover:text-warning-900 text-sm font-medium"
                        >
                          Suspend
                        </button>
                      )}
                      {vendor.verificationStatus === 'approved' && vendor.status === 'suspended' && (
                        <button
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setActionNotes('');
                          }}
                          className="text-success-600 hover:text-success-900 text-sm font-medium"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedVendor.registrationData?.step1?.legalBusinessName}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Current Status: {selectedVendor.verificationStatus} / {selectedVendor.status}
              </p>
            </div>
            
            <div className="px-6 py-4">
              <label className="label">Action Notes (Optional)</label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows="3"
                className="input-field"
                placeholder="Add notes about your decision..."
              />
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setSelectedVendor(null);
                    setActionNotes('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const action = 
                        selectedVendor.verificationStatus === 'pending' ? 'reject' :
                        selectedVendor.status === 'active' ? 'suspend' : 'activate';
                      handleAction(action);
                    }}
                    className={`px-4 py-2 rounded-lg text-white ${
                      selectedVendor.verificationStatus === 'pending' || selectedVendor.status === 'active'
                        ? 'bg-danger-600 hover:bg-danger-700'
                        : 'bg-success-600 hover:bg-success-700'
                    }`}
                  >
                    {selectedVendor.verificationStatus === 'pending' ? 'Reject' :
                     selectedVendor.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                  {selectedVendor.verificationStatus === 'pending' && (
                    <button
                      onClick={() => handleAction('approve')}
                      className="btn-success px-4 py-2"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorList;