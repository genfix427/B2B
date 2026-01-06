import { useState } from 'react';
import { toast } from 'react-toastify';

const Step7 = ({ onSubmit, loading, registrationData }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showFullReview, setShowFullReview] = useState(false);

  const handleSubmit = () => {
    if (!acceptedTerms) {
      toast.error('You must accept the terms and conditions');
      return;
    }
    onSubmit();
  };

  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    return phone;
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.address1}${address.address2 ? ', ' + address.address2 : ''}, ${address.city}, ${address.state} ${address.zipCode}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleFullReview = () => {
    setShowFullReview(!showFullReview);
  };

  return (
    <div className="space-y-6">
      <div className="step-header">
        <h2 className="step-title">Review & Submit Registration</h2>
        <p className="step-subtitle">Please review all information before submitting</p>
      </div>

      {/* Summary View */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Registration Summary</h3>
          <button
            type="button"
            onClick={toggleFullReview}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            {showFullReview ? 'Show Less' : 'View Full Details'}
          </button>
        </div>

        {/* Key Information - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Business Information</h4>
            <p className="text-sm text-gray-600">
              <strong>Name:</strong> {registrationData.step1?.legalBusinessName || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>DBA:</strong> {registrationData.step1?.doingBusinessAs || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>NPI:</strong> {registrationData.step1?.npiNumber || 'N/A'}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {registrationData.step1?.email || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Phone:</strong> {formatPhone(registrationData.step1?.phone)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Owner:</strong> {registrationData.step2?.owner?.firstName} {registrationData.step2?.owner?.lastName}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Business Details</h4>
            <p className="text-sm text-gray-600">
              <strong>Type:</strong> {registrationData.step5?.pharmacyInfo?.pharmacyType || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Enterprise:</strong> {registrationData.step5?.pharmacyInfo?.enterpriseType || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Locations:</strong> {registrationData.step5?.pharmacyInfo?.numberOfLocations || 'N/A'}
            </p>
          </div>
        </div>

        {/* Full Review Details (Collapsible) */}
        {showFullReview && (
          <div className="space-y-6 border-t border-gray-200 pt-6">
            {/* Step 1 Detailed Review */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 text-lg mb-4">Step 1: Pharmacy Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Legal Business Name</p>
                  <p className="font-medium">{registrationData.step1?.legalBusinessName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">NPI #</p>
                  <p className="font-medium">{registrationData.step1?.npiNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">DBA Name</p>
                  <p className="font-medium">{registrationData.step1?.doingBusinessAs || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Federal EIN</p>
                  <p className="font-medium">{registrationData.step1?.federalEIN || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Shipping Address</p>
                  <p className="font-medium">{formatAddress(registrationData.step1?.shippingAddress)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Mailing Address</p>
                  <p className="font-medium">
                    {registrationData.step1?.isMailingSameAsShipping 
                      ? 'Same as Shipping Address' 
                      : formatAddress(registrationData.step1?.mailingAddress)}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 Detailed Review */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 text-lg mb-4">Step 2: Pharmacy Owner</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">
                    {registrationData.step2?.owner?.firstName || 'N/A'} {registrationData.step2?.owner?.lastName || ''}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{registrationData.step2?.owner?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <p className="font-medium">{formatPhone(registrationData.step2?.owner?.mobile)}</p>
                </div>
              </div>
            </div>

            {/* Step 3 Detailed Review */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-semibold text-purple-800 text-lg mb-4">Step 3: Primary Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Title/Position</p>
                  <p className="font-medium">{registrationData.step3?.primaryContact?.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">
                    {registrationData.step3?.primaryContact?.firstName || 'N/A'} {registrationData.step3?.primaryContact?.lastName || ''}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{registrationData.step3?.primaryContact?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <p className="font-medium">{formatPhone(registrationData.step3?.primaryContact?.mobile)}</p>
                </div>
              </div>
            </div>

            {/* Step 4 Detailed Review */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-800 text-lg mb-4">Step 4: Pharmacy License</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">DEA #</p>
                  <p className="font-medium">{registrationData.step4?.licenses?.deaNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">DEA Expiration</p>
                  <p className="font-medium">{formatDate(registrationData.step4?.licenses?.deaExpiration)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">State License #</p>
                  <p className="font-medium">{registrationData.step4?.licenses?.stateLicenseNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">State License Expiration</p>
                  <p className="font-medium">{formatDate(registrationData.step4?.licenses?.stateLicenseExpiration)}</p>
                </div>
              </div>
            </div>

            {/* Step 5 Detailed Review */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="font-semibold text-indigo-800 text-lg mb-4">Step 5: Pharmacy Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Enterprise Type</p>
                  <p className="font-medium">{registrationData.step5?.pharmacyInfo?.enterpriseType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Primary Wholesaler</p>
                  <p className="font-medium">{registrationData.step5?.pharmacyInfo?.primaryWholesaler || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pharmacy Type</p>
                  <p className="font-medium">{registrationData.step5?.pharmacyInfo?.pharmacyType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pharmacy Software</p>
                  <p className="font-medium">{registrationData.step5?.pharmacyInfo?.pharmacySoftware || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Hours of Operation</p>
                  <p className="font-medium">{registrationData.step5?.pharmacyInfo?.hoursOfOperation || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Number of Locations</p>
                  <p className="font-medium">{registrationData.step5?.pharmacyInfo?.numberOfLocations || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Step 6 Detailed Review */}
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
              <h3 className="font-semibold text-pink-800 text-lg mb-4">Step 6: Referral Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">How did you hear about us?</p>
                  <p className="font-medium">{registrationData.step6?.referralInfo?.hearAboutUs || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Promo Code</p>
                  <p className="font-medium">{registrationData.step6?.referralInfo?.promoCode || 'None'}</p>
                </div>
                {registrationData.step6?.referralInfo?.referredBy && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Referred By</p>
                    <p className="font-medium">{registrationData.step6.referralInfo.referredBy}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Terms Agreement */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Important Notice & Terms of Service</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p className="mb-3">
                  By submitting this registration, you acknowledge and agree to the following:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>All information provided is accurate and complete to the best of your knowledge</li>
                  <li>You will upload all required documents for verification</li>
                  <li>Your account will remain inactive until verified by our admin team (1-2 business days)</li>
                  <li>You agree to the MatchRX Terms of Service and Privacy Policy</li>
                  <li>You consent to receive email notifications regarding your account status</li>
                  <li>You are authorized to represent the pharmacy listed in this registration</li>
                </ul>
                
                <div className="flex items-start mt-4">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="terms" className="ml-2 text-yellow-800">
                    <span className="font-medium">I have read and agree to the Terms of Service and acknowledge all statements above *</span>
                    {!acceptedTerms && (
                      <p className="text-red-500 text-sm mt-1">You must accept the terms to continue</p>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3">What happens next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-blue-700">Submit Registration</h4>
              <p className="text-sm text-blue-600 mt-1">Create your account with all provided information</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-blue-700">Upload Documents</h4>
              <p className="text-sm text-blue-600 mt-1">Upload required documents for verification</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-blue-700">Admin Verification</h4>
              <p className="text-sm text-blue-600 mt-1">Wait for admin approval (1-2 business days)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
          disabled={loading}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Step 6
        </button>
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={toggleFullReview}
            className="px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            disabled={loading}
          >
            {showFullReview ? 'Show Summary' : 'View Full Details'}
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary px-8 py-3 flex items-center"
            disabled={loading || !acceptedTerms}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Submit Registration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step7;