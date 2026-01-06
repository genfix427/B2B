import { useState } from 'react';
import { format } from 'date-fns';

const VendorDetail = ({ vendor, onAction, onDocumentReview, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [actionNotes, setActionNotes] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');

  const handleAction = (action) => {
    setSelectedAction(action);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    onAction(vendor._id, selectedAction, actionNotes);
    setShowActionModal(false);
    setActionNotes('');
    setSelectedAction('');
  };

  const handleDocumentAction = (status) => {
    onDocumentReview(vendor._id, status, reviewNotes);
    setShowDocumentModal(false);
    setReviewNotes('');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: 'Documents' },
    { id: 'business', label: 'Business Info' },
    { id: 'license', label: 'Licenses' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-success-100 text-success-800';
      case 'pending': return 'bg-warning-100 text-warning-800';
      case 'rejected': return 'bg-danger-100 text-danger-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium mb-4 flex items-center"
          >
            ← Back to Vendors
          </button>
          <h1 className="page-title">{vendor.registrationData?.step1?.legalBusinessName}</h1>
          <p className="page-subtitle">
            NPI: {vendor.registrationData?.step1?.npiNumber} • 
            Registered: {format(new Date(vendor.createdAt), 'MMM dd, yyyy')}
          </p>
        </div>
        <div className="flex space-x-3">
          {vendor.verificationStatus === 'pending' && (
            <>
              <button
                onClick={() => handleAction('reject')}
                className="btn-danger"
              >
                Reject
              </button>
              <button
                onClick={() => handleAction('approve')}
                className="btn-success"
              >
                Approve
              </button>
            </>
          )}
          {vendor.verificationStatus === 'approved' && vendor.status === 'active' && (
            <button
              onClick={() => handleAction('suspend')}
              className="btn-warning"
            >
              Suspend Account
            </button>
          )}
          {vendor.verificationStatus === 'approved' && vendor.status === 'suspended' && (
            <button
              onClick={() => handleAction('activate')}
              className="btn-success"
            >
              Activate Account
            </button>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Verification Status</p>
              <p className="text-2xl font-bold text-gray-900 mt-2 capitalize">
                {vendor.verificationStatus}
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vendor.verificationStatus)}`}>
              {vendor.verificationStatus}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Account Status</p>
              <p className="text-2xl font-bold text-gray-900 mt-2 capitalize">
                {vendor.status}
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              vendor.status === 'active' ? 'bg-success-100 text-success-800' :
              vendor.status === 'suspended' ? 'bg-danger-100 text-danger-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {vendor.status}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Documents</p>
              <p className="text-2xl font-bold text-gray-900 mt-2 capitalize">
                {vendor.documents?.status || 'Not Uploaded'}
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              vendor.documents?.status === 'approved' ? 'bg-success-100 text-success-800' :
              vendor.documents?.status === 'pending' ? 'bg-warning-100 text-warning-800' :
              vendor.documents?.status === 'rejected' ? 'bg-danger-100 text-danger-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {vendor.documents?.status || 'Missing'}
            </span>
          </div>
        </div>
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
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="card">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700">Business Email</p>
                  <p className="text-sm text-gray-900">{vendor.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-900">{vendor.registrationData?.step1?.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Owner</p>
                  <p className="text-sm text-gray-900">
                    {vendor.registrationData?.step2?.owner?.firstName} {vendor.registrationData?.step2?.owner?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{vendor.registrationData?.step2?.owner?.email}</p>
                  <p className="text-sm text-gray-500">{vendor.registrationData?.step2?.owner?.mobile}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Primary Contact</p>
                  <p className="text-sm text-gray-900">
                    {vendor.registrationData?.step3?.primaryContact?.firstName} {vendor.registrationData?.step3?.primaryContact?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{vendor.registrationData?.step3?.primaryContact?.title}</p>
                  <p className="text-sm text-gray-500">{vendor.registrationData?.step3?.primaryContact?.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700">Business Type</p>
                  <p className="text-sm text-gray-900">{vendor.registrationData?.step5?.pharmacyInfo?.enterpriseType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Pharmacy Type</p>
                  <p className="text-sm text-gray-900">{vendor.registrationData?.step5?.pharmacyInfo?.pharmacyType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Primary Wholesaler</p>
                  <p className="text-sm text-gray-900">{vendor.registrationData?.step5?.pharmacyInfo?.primaryWholesaler}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Number of Locations</p>
                  <p className="text-sm text-gray-900">{vendor.registrationData?.step5?.pharmacyInfo?.numberOfLocations}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Uploaded Documents</h3>
              {vendor.documentsUploaded && vendor.documents?.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setReviewNotes('');
                      setShowDocumentModal(true);
                    }}
                    className="btn-danger"
                  >
                    Reject Documents
                  </button>
                  <button
                    onClick={() => {
                      setReviewNotes('');
                      setShowDocumentModal(true);
                    }}
                    className="btn-success"
                  >
                    Approve Documents
                  </button>
                </div>
              )}
            </div>

            {vendor.documentsUploaded ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'deaLicense', label: 'DEA License' },
                  { id: 'stateLicense', label: 'State License' },
                  { id: 'businessLicense', label: 'Business License' },
                  { id: 'einDocument', label: 'EIN Document' },
                  { id: 'w9Form', label: 'W-9 Form' },
                  { id: 'voidedCheck', label: 'Voided Check' },
                  { id: 'additionalDoc1', label: 'Additional Document 1' },
                  { id: 'additionalDoc2', label: 'Additional Document 2' },
                ].map((doc) => (
                  vendor.documents?.[doc.id] && (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{doc.label}</h4>
                        <a
                          href={vendor.documents[doc.id]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 text-sm"
                        >
                          View →
                        </a>
                      </div>
                      <p className="text-xs text-gray-500">
                        Uploaded: {vendor.documents.uploadedAt ? format(new Date(vendor.documents.uploadedAt), 'MMM dd, yyyy') : 'N/A'}
                      </p>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No documents uploaded yet.</p>
              </div>
            )}

            {vendor.documents?.reviewNotes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Review Notes</h4>
                <p className="text-sm text-yellow-700">{vendor.documents.reviewNotes}</p>
                {vendor.documents.reviewedAt && (
                  <p className="text-xs text-yellow-600 mt-2">
                    Reviewed on: {format(new Date(vendor.documents.reviewedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'business' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Business Address</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900">
                  {vendor.registrationData?.step1?.shippingAddress?.address1}
                  {vendor.registrationData?.step1?.shippingAddress?.address2 && `, ${vendor.registrationData.step1.shippingAddress.address2}`}
                </p>
                <p className="text-sm text-gray-900">
                  {vendor.registrationData?.step1?.shippingAddress?.city}, 
                  {vendor.registrationData?.step1?.shippingAddress?.state} 
                  {vendor.registrationData?.step1?.shippingAddress?.zipCode}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Business Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Federal EIN</p>
                  <p className="text-sm text-gray-900">{vendor.registrationData?.step1?.federalEIN}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">State Tax ID</p>
                  <p className="text-sm text-gray-900">{vendor.registrationData?.step1?.stateTaxID || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">GLN Number</p>
                  <p className="text-sm text-gray-900">{vendor.registrationData?.step1?.globalLocationNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Timezone</p>
                  <p className="text-sm text-gray-900">{vendor.registrationData?.step1?.timezone}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Software & Operations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Pharmacy Software</p>
                  <p className="text-sm text-gray-900">{vendor.registrationData?.step5?.pharmacyInfo?.pharmacySoftware}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Hours of Operation</p>
                  <p className="text-sm text-gray-900">{vendor.registrationData?.step5?.pharmacyInfo?.hoursOfOperation}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'license' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">License Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700">DEA Number</p>
                  <p className="text-sm text-gray-900">{vendor.registrationData?.step4?.licenses?.deaNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">DEA Expiration</p>
                  <p className="text-sm text-gray-900">
                    {vendor.registrationData?.step4?.licenses?.deaExpiration 
                      ? format(new Date(vendor.registrationData.step4.licenses.deaExpiration), 'MMM dd, yyyy')
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">State License Number</p>
                  <p className="text-sm text-gray-900">{vendor.registrationData?.step4?.licenses?.stateLicenseNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">State License Expiration</p>
                  <p className="text-sm text-gray-900">
                    {vendor.registrationData?.step4?.licenses?.stateLicenseExpiration
                      ? format(new Date(vendor.registrationData.step4.licenses.stateLicenseExpiration), 'MMM dd, yyyy')
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedAction === 'approve' ? 'Approve Vendor' :
                 selectedAction === 'reject' ? 'Reject Vendor' :
                 selectedAction === 'suspend' ? 'Suspend Account' :
                 'Activate Account'}
              </h3>
            </div>
            
            <div className="px-6 py-4">
              <label className="label">Notes (Optional)</label>
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
                    setShowActionModal(false);
                    setActionNotes('');
                    setSelectedAction('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 rounded-lg text-white ${
                    selectedAction === 'approve' || selectedAction === 'activate'
                      ? 'bg-success-600 hover:bg-success-700'
                      : 'bg-danger-600 hover:bg-danger-700'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Review Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Review Documents</h3>
            </div>
            
            <div className="px-6 py-4">
              <label className="label">Review Notes (Optional)</label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows="3"
                className="input-field"
                placeholder="Add notes about your review..."
              />
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setShowDocumentModal(false);
                    setReviewNotes('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDocumentAction('rejected')}
                    className="btn-danger px-4 py-2"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDocumentAction('approved')}
                    className="btn-success px-4 py-2"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetail;