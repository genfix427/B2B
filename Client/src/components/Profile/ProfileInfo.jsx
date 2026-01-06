import { useState, useEffect } from 'react';

const ProfileInfo = ({ profile, onUpdate, loading }) => {
  const [activeSection, setActiveSection] = useState('business');
  const [formData, setFormData] = useState({
    profile: {
      businessDescription: '',
      website: '',
      yearEstablished: '',
      averageMonthlyVolume: '',
      specialties: [],
      additionalNotes: ''
    }
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        profile: {
          businessDescription: profile.profile?.businessDescription || '',
          website: profile.profile?.website || '',
          yearEstablished: profile.profile?.yearEstablished || '',
          averageMonthlyVolume: profile.profile?.averageMonthlyVolume || '',
          specialties: profile.profile?.specialties || [],
          additionalNotes: profile.profile?.additionalNotes || ''
        }
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      profile: {
        ...prev.profile,
        [name]: value
      }
    }));
  };

  const handleArrayChange = (field, value) => {
    const values = value.split(',').map(v => v.trim()).filter(v => v);
    setFormData(prev => ({
      profile: {
        ...prev.profile,
        [field]: values
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdate(formData);
  };

  const sections = [
    { id: 'business', name: 'Business Info', icon: '🏢' },
    { id: 'contact', name: 'Contact Info', icon: '📞' },
    { id: 'licenses', name: 'Licenses', icon: '📋' },
    { id: 'pharmacy', name: 'Pharmacy Details', icon: '💊' }
  ];

  const renderSectionContent = () => {
    if (!profile?.registrationData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No registration data available</p>
        </div>
      );
    }

    const { registrationData } = profile;

    switch (activeSection) {
      case 'business':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Legal Business Name</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{registrationData.step1?.legalBusinessName || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DBA</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{registrationData.step1?.doingBusinessAs || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NPI Number</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{registrationData.step1?.npiNumber || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Federal EIN</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{registrationData.step1?.federalEIN || 'Not provided'}</p>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{profile.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{registrationData.step1?.phone || 'Not provided'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">
                  {registrationData.step1?.shippingAddress?.street && (
                    <>
                      {registrationData.step1.shippingAddress.street}<br />
                      {registrationData.step1.shippingAddress.city}, {registrationData.step1.shippingAddress.state} {registrationData.step1.shippingAddress.zip}<br />
                      {registrationData.step1.shippingAddress.country}
                    </>
                  ) || 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'licenses':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DEA License</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">
                  {registrationData.step4?.licenses?.deaLicense || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State License</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">
                  {registrationData.step4?.licenses?.stateLicense || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State Control License</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">
                  {registrationData.step4?.licenses?.stateControlLicense || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State Board of Pharmacy</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">
                  {registrationData.step4?.licenses?.boardOfPharmacy || 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'pharmacy':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Type</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">
                  {registrationData.step5?.pharmacyInfo?.pharmacyType || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Focus</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">
                  {registrationData.step5?.pharmacyInfo?.primaryFocus || 'Not provided'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Services Offered</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {registrationData.step5?.pharmacyInfo?.services?.map((service, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {service}
                    </span>
                  )) || <p className="text-gray-500">No services specified</p>}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Registration Data Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Registration Information</h2>
          <p className="text-gray-600 mt-1">View your registration details submitted during signup</p>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto px-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === section.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.name}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {renderSectionContent()}
        </div>
      </div>

      {/* Business Profile Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Profile</h2>
        <p className="text-gray-600 mb-6">Update your business profile information</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Description
              </label>
              <textarea
                name="businessDescription"
                value={formData.profile.businessDescription}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe your business..."
              />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.profile.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year Established
                </label>
                <input
                  type="number"
                  name="yearEstablished"
                  value={formData.profile.yearEstablished}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="2020"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Monthly Volume
                </label>
                <select
                  name="averageMonthlyVolume"
                  value={formData.profile.averageMonthlyVolume}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select volume range</option>
                  <option value="0-100">0-100 prescriptions</option>
                  <option value="101-500">101-500 prescriptions</option>
                  <option value="501-1000">501-1,000 prescriptions</option>
                  <option value="1001-5000">1,001-5,000 prescriptions</option>
                  <option value="5000+">5,000+ prescriptions</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialties (comma-separated)
            </label>
            <input
              type="text"
              value={formData.profile.specialties.join(', ')}
              onChange={(e) => handleArrayChange('specialties', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Compounding, Oncology, Pediatrics"
            />
            <p className="text-sm text-gray-500 mt-1">Enter specialties separated by commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              name="additionalNotes"
              value={formData.profile.additionalNotes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Any additional information about your business..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;