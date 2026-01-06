import { useState } from 'react';

const CompleteProfileInfo = ({ profile }) => {
  const [activeSection, setActiveSection] = useState('basic-info');

  if (!profile?.registrationData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No registration data available</p>
      </div>
    );
  }

  const { registrationData } = profile;

  // Define all sections
  const sections = [
    { id: 'basic-info', name: 'Basic Information', icon: '📋', step: 'step1' },
    { id: 'owner-info', name: 'Owner Information', icon: '👤', step: 'step2' },
    { id: 'contact-info', name: 'Contact Information', icon: '📞', step: 'step3' },
    { id: 'licenses', name: 'Licenses & Certifications', icon: '📜', step: 'step4' },
    { id: 'pharmacy-details', name: 'Pharmacy Details', icon: '💊', step: 'step5' },
    { id: 'referral-info', name: 'Referral Information', icon: '🤝', step: 'step6' },
    { id: 'business-profile', name: 'Business Profile', icon: '🏢', step: 'profile' },
    { id: 'documents', name: 'Documents', icon: '📄', step: 'documents' },
    { id: 'account-status', name: 'Account Status', icon: '✅', step: 'status' }
  ];

  // Helper function to render address
  const renderAddress = (address) => {
    if (!address || !address.street) return 'Not provided';
    return (
      <div>
        <div>{address.street}</div>
        <div>{address.city}, {address.state} {address.zip}</div>
        <div>{address.country}</div>
      </div>
    );
  };

  // Render section content based on active section
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'basic-info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Information</h3>
                <InfoField label="Legal Business Name" value={registrationData.step1?.legalBusinessName} />
                <InfoField label="Doing Business As (DBA)" value={registrationData.step1?.doingBusinessAs} />
                <InfoField label="NPI Number" value={registrationData.step1?.npiNumber} />
                <InfoField label="Federal EIN" value={registrationData.step1?.federalEIN} />
                <InfoField label="State Tax ID" value={registrationData.step1?.stateTaxID} />
                <InfoField label="Global Location Number" value={registrationData.step1?.globalLocationNumber} />
                <InfoField label="Timezone" value={registrationData.step1?.timezone} />
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Information</h3>
                <InfoField label="Email" value={profile.email} />
                <InfoField label="Phone" value={registrationData.step1?.phone} />
                <InfoField label="Fax" value={registrationData.step1?.fax} />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                  <div className="bg-gray-50 p-3 rounded">
                    {renderAddress(registrationData.step1?.shippingAddress)}
                  </div>
                </div>

                {!registrationData.step1?.isMailingSameAsShipping && registrationData.step1?.mailingAddress && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mailing Address</label>
                    <div className="bg-gray-50 p-3 rounded">
                      {renderAddress(registrationData.step1.mailingAddress)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'owner-info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Owner Details</h3>
                <InfoField label="Owner Type" value={registrationData.step2?.owner?.ownerType} />
                <InfoField label="First Name" value={registrationData.step2?.owner?.firstName} />
                <InfoField label="Middle Name" value={registrationData.step2?.owner?.middleName} />
                <InfoField label="Last Name" value={registrationData.step2?.owner?.lastName} />
                <InfoField label="Title/Position" value={registrationData.step2?.owner?.title} />
                <InfoField label="Ownership Percentage" value={registrationData.step2?.owner?.ownershipPercentage} />
                <InfoField label="Date of Birth" value={registrationData.step2?.owner?.dateOfBirth} />
                <InfoField label="Social Security Number" value={registrationData.step2?.owner?.ssn ? '●●●●●●●●●' : 'Not provided'} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Information</h3>
                <InfoField label="Email" value={registrationData.step2?.owner?.email} />
                <InfoField label="Phone" value={registrationData.step2?.owner?.phone} />
                <InfoField label="Mobile Phone" value={registrationData.step2?.owner?.mobilePhone} />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                  <div className="bg-gray-50 p-3 rounded">
                    {registrationData.step2?.owner?.address ? (
                      <>
                        <div>{registrationData.step2.owner.address.street}</div>
                        <div>{registrationData.step2.owner.address.city}, {registrationData.step2.owner.address.state} {registrationData.step2.owner.address.zip}</div>
                      </>
                    ) : 'Not provided'}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Owner Identification</label>
                  <InfoField label="Driver's License/State ID" value={registrationData.step2?.owner?.driversLicense} />
                  <InfoField label="Passport Number" value={registrationData.step2?.owner?.passportNumber} />
                  <InfoField label="US Citizenship Status" value={registrationData.step2?.owner?.usCitizenshipStatus} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact-info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Primary Contact</h3>
                <InfoField label="First Name" value={registrationData.step3?.primaryContact?.firstName} />
                <InfoField label="Middle Name" value={registrationData.step3?.primaryContact?.middleName} />
                <InfoField label="Last Name" value={registrationData.step3?.primaryContact?.lastName} />
                <InfoField label="Title/Position" value={registrationData.step3?.primaryContact?.title} />
                <InfoField label="Email" value={registrationData.step3?.primaryContact?.email} />
                <InfoField label="Phone" value={registrationData.step3?.primaryContact?.phone} />
                <InfoField label="Mobile Phone" value={registrationData.step3?.primaryContact?.mobilePhone} />
                <InfoField label="Fax" value={registrationData.step3?.primaryContact?.fax} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Additional Information</h3>
                <InfoField label="Preferred Contact Method" value={registrationData.step3?.primaryContact?.preferredContactMethod} />
                <InfoField label="Best Time to Contact" value={registrationData.step3?.primaryContact?.bestTimeToContact} />
                <InfoField label="Can Receive Text Messages?" value={registrationData.step3?.primaryContact?.canReceiveTextMessages ? 'Yes' : 'No'} />
                <InfoField label="Can Receive Email?" value={registrationData.step3?.primaryContact?.canReceiveEmail ? 'Yes' : 'No'} />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mailing Address</label>
                  <div className="bg-gray-50 p-3 rounded">
                    {registrationData.step3?.primaryContact?.mailingAddress ? (
                      <>
                        <div>{registrationData.step3.primaryContact.mailingAddress.street}</div>
                        <div>{registrationData.step3.primaryContact.mailingAddress.city}, {registrationData.step3.primaryContact.mailingAddress.state} {registrationData.step3.primaryContact.mailingAddress.zip}</div>
                      </>
                    ) : 'Not provided'}
                  </div>
                </div>

                <InfoField label="Emergency Contact Name" value={registrationData.step3?.primaryContact?.emergencyContactName} />
                <InfoField label="Emergency Contact Phone" value={registrationData.step3?.primaryContact?.emergencyContactPhone} />
              </div>
            </div>
          </div>
        );

      case 'licenses':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Primary Licenses</h3>
                <InfoField label="DEA License Number" value={registrationData.step4?.licenses?.deaLicense} />
                <InfoField label="DEA License Expiration" value={registrationData.step4?.licenses?.deaLicenseExpiration} />
                <InfoField label="State Pharmacy License" value={registrationData.step4?.licenses?.stateLicense} />
                <InfoField label="State License Expiration" value={registrationData.step4?.licenses?.stateLicenseExpiration} />
                <InfoField label="State Control License" value={registrationData.step4?.licenses?.stateControlLicense} />
                <InfoField label="Control License Expiration" value={registrationData.step4?.licenses?.controlLicenseExpiration} />
                <InfoField label="State Board of Pharmacy" value={registrationData.step4?.licenses?.boardOfPharmacy} />
                <InfoField label="Board Registration Number" value={registrationData.step4?.licenses?.boardRegistrationNumber} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Additional Certifications</h3>
                <InfoField label="Medicare/Medicaid Number" value={registrationData.step4?.licenses?.medicareMedicaidNumber} />
                <InfoField label="NCPDP Number" value={registrationData.step4?.licenses?.ncpdpNumber} />
                <InfoField label="NABP e-Profile ID" value={registrationData.step4?.licenses?.nabpEProfileId} />
                <InfoField label="State Controlled Substance Registration" value={registrationData.step4?.licenses?.stateControlledSubstanceReg} />
                <InfoField label="DEA Controlled Substance Registration" value={registrationData.step4?.licenses?.deaControlledSubstanceReg} />
                <InfoField label="Accreditation/Certifications" value={registrationData.step4?.licenses?.accreditations} />
                <InfoField label="State Business License" value={registrationData.step4?.licenses?.stateBusinessLicense} />
                <InfoField label="Local Business License" value={registrationData.step4?.licenses?.localBusinessLicense} />
              </div>
            </div>
          </div>
        );

      case 'pharmacy-details':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Pharmacy Information</h3>
                <InfoField label="Pharmacy Type" value={registrationData.step5?.pharmacyInfo?.pharmacyType} />
                <InfoField label="Primary Focus/Specialty" value={registrationData.step5?.pharmacyInfo?.primaryFocus} />
                <InfoField label="Years in Operation" value={registrationData.step5?.pharmacyInfo?.yearsInOperation} />
                <InfoField label="Number of Pharmacists" value={registrationData.step5?.pharmacyInfo?.numberOfPharmacists} />
                <InfoField label="Number of Pharmacy Technicians" value={registrationData.step5?.pharmacyInfo?.numberOfTechnicians} />
                <InfoField label="Number of Support Staff" value={registrationData.step5?.pharmacyInfo?.numberOfSupportStaff} />
                <InfoField label="Square Footage" value={registrationData.step5?.pharmacyInfo?.squareFootage} />
                <InfoField label="Number of Locations" value={registrationData.step5?.pharmacyInfo?.numberOfLocations} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Services & Operations</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
                  <div className="flex flex-wrap gap-2">
                    {registrationData.step5?.pharmacyInfo?.services?.map((service, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {service}
                      </span>
                    )) || <span className="text-gray-500">No services specified</span>}
                  </div>
                </div>

                <InfoField label="Average Daily Prescription Volume" value={registrationData.step5?.pharmacyInfo?.avgDailyPrescriptions} />
                <InfoField label="Compounding Capabilities" value={registrationData.step5?.pharmacyInfo?.compoundingCapabilities} />
                <InfoField label="Specialty Medications Handled" value={registrationData.step5?.pharmacyInfo?.specialtyMedications} />
                <InfoField label="Compounding Certification" value={registrationData.step5?.pharmacyInfo?.compoundingCertification} />
                <InfoField label="IV Room Available" value={registrationData.step5?.pharmacyInfo?.ivRoomAvailable ? 'Yes' : 'No'} />
                <InfoField label="Clean Room Available" value={registrationData.step5?.pharmacyInfo?.cleanRoomAvailable ? 'Yes' : 'No'} />
                <InfoField label="Sterile Compounding" value={registrationData.step5?.pharmacyInfo?.sterileCompounding ? 'Yes' : 'No'} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {registrationData.step5?.pharmacyInfo?.businessHours && 
                  Object.entries(registrationData.step5.pharmacyInfo.businessHours).map(([day, hours]) => (
                    <div key={day} className="bg-gray-50 p-3 rounded">
                      <span className="font-medium capitalize">{day}:</span>
                      <span className="ml-2">{hours || 'Closed'}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        );

      case 'referral-info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Referral Source</h3>
                <InfoField label="How did you hear about us?" value={registrationData.step6?.referralInfo?.referralSource} />
                <InfoField label="Referral Name" value={registrationData.step6?.referralInfo?.referralName} />
                <InfoField label="Referral Organization" value={registrationData.step6?.referralInfo?.referralOrganization} />
                <InfoField label="Referral Contact" value={registrationData.step6?.referralInfo?.referralContact} />
                <InfoField label="Marketing Campaign" value={registrationData.step6?.referralInfo?.marketingCampaign} />
                <InfoField label="Industry Event" value={registrationData.step6?.referralInfo?.industryEvent} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Relationships</h3>
                <InfoField label="Current Wholesalers" value={registrationData.step6?.referralInfo?.currentWholesalers} />
                <InfoField label="Pharmacy Management System" value={registrationData.step6?.referralInfo?.pharmacyManagementSystem} />
                <InfoField label="Electronic Prescribing System" value={registrationData.step6?.referralInfo?.electronicPrescribingSystem} />
                <InfoField label="Inventory Management System" value={registrationData.step6?.referralInfo?.inventoryManagementSystem} />
                <InfoField label="Major Insurance Carriers" value={registrationData.step6?.referralInfo?.insuranceCarriers} />
                <InfoField label="Preferred Communication Method" value={registrationData.step6?.referralInfo?.preferredCommunication} />
              </div>
            </div>
          </div>
        );

      case 'business-profile':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Profile</h3>
                {profile.profile?.profileImage && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                    <img 
                      src={profile.profile.profileImage} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover border"
                    />
                  </div>
                )}
                <InfoField label="Business Description" value={profile.profile?.businessDescription} />
                <InfoField label="Website" value={profile.profile?.website} />
                <InfoField label="Year Established" value={profile.profile?.yearEstablished} />
                <InfoField label="Average Monthly Volume" value={profile.profile?.averageMonthlyVolume} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Specialties & Notes</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {profile.profile?.specialties?.map((specialty, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {specialty}
                      </span>
                    )) || <span className="text-gray-500">No specialties specified</span>}
                  </div>
                </div>

                <InfoField label="Additional Notes" value={profile.profile?.additionalNotes} />
                
                {profile.profile?.updatedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <p className="text-gray-900 bg-gray-50 p-2 rounded">
                      {new Date(profile.profile.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Uploaded Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.documents && Object.entries({
                deaLicense: 'DEA License',
                stateLicense: 'State License',
                businessLicense: 'Business License',
                einDocument: 'EIN Document',
                w9Form: 'W-9 Form',
                voidedCheck: 'Voided Check',
                additionalDoc1: 'Additional Document 1',
                additionalDoc2: 'Additional Document 2'
              }).map(([key, label]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">{label}</h4>
                  {profile.documents[key] ? (
                    <div>
                      <p className="text-sm text-green-600 mb-1">✓ Uploaded</p>
                      <p className="text-xs text-gray-500 truncate">
                        {profile.documents[key]}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-yellow-600">Pending upload</p>
                  )}
                </div>
              ))}
            </div>
            
            {profile.documents?.uploadedAt && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  Documents uploaded on: {new Date(profile.documents.uploadedAt).toLocaleString()}
                </p>
                {profile.documents.status && (
                  <p className="text-sm font-medium mt-1">
                    Status: <span className={`${profile.documents.status === 'approved' ? 'text-green-600' : profile.documents.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {profile.documents.status.toUpperCase()}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 'account-status':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Account Information</h3>
                <InfoField label="Account Status" value={profile.status || 'active'} badge />
                <InfoField label="Role" value={profile.role || 'vendor'} badge />
                <InfoField label="Email Verified" value={profile.isVerified ? 'Yes' : 'No'} />
                <InfoField label="Verification Status" value={profile.verificationStatus || 'pending'} badge />
                <InfoField label="Registration Completed" value={profile.registrationCompleted ? 'Yes' : 'No'} />
                <InfoField label="Documents Uploaded" value={profile.documentsUploaded ? 'Yes' : 'No'} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Activity Tracking</h3>
                <InfoField label="Account Created" value={profile.createdAt ? new Date(profile.createdAt).toLocaleString() : 'N/A'} />
                <InfoField label="Registration Submitted" value={profile.registrationSubmittedAt ? new Date(profile.registrationSubmittedAt).toLocaleString() : 'N/A'} />
                <InfoField label="Last Login" value={profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'Never'} />
                <InfoField label="Login Count" value={profile.loginCount || 0} />
                <InfoField label="Last Updated" value={profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : 'N/A'} />
                
                {profile.verificationNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verification Notes</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded">{profile.verificationNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto px-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeSection === section.id
                  ? 'border-primary-500 text-primary-600 bg-primary-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.name}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Section Content */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {sections.find(s => s.id === activeSection)?.name}
          </h2>
          <p className="text-gray-600 mt-1">
            View and manage your {sections.find(s => s.id === activeSection)?.name.toLowerCase()}
          </p>
        </div>
        
        {renderSectionContent()}
      </div>
    </div>
  );
};

// Helper component for info fields
const InfoField = ({ label, value, badge = false }) => {
  if (!value && value !== 0) return null;
  
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {badge ? (
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          value === 'approved' || value === 'active' || value === 'admin' 
            ? 'bg-green-100 text-green-800'
            : value === 'pending' || value === 'vendor'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ) : (
        <p className="text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
          {value}
        </p>
      )}
    </div>
  );
};

export default CompleteProfileInfo;