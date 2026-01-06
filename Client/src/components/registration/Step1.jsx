import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Alaska',
  'America/Hawaii',
  'America/Puerto_Rico'
];

const Step1 = ({ onSubmit, loading, initialData }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {}
  });
  
  const isMailingSameAsShipping = watch('isMailingSameAsShipping');
  const shippingAddress = watch('shippingAddress');

  // Set mailing address same as shipping when checkbox is checked
  useEffect(() => {
    if (isMailingSameAsShipping && shippingAddress) {
      setValue('mailingAddress', shippingAddress);
    }
  }, [isMailingSameAsShipping, shippingAddress, setValue]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="step-header">
        <h2 className="step-title">Pharmacy Information</h2>
        <p className="step-subtitle">Please provide your pharmacy details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pharmacy Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
        </div>
        
        <div>
          <label className="label">NPI # *</label>
          <input
            type="text"
            className="input-field"
            {...register('npiNumber', { 
              required: 'NPI number is required',
              pattern: {
                value: /^\d{10}$/,
                message: 'NPI must be 10 digits'
              }
            })}
          />
          {errors.npiNumber && <p className="text-red-500 text-sm mt-1">{errors.npiNumber.message}</p>}
        </div>

        <div>
          <label className="label">Legal Business Name *</label>
          <input
            type="text"
            className="input-field"
            {...register('legalBusinessName', { required: 'Legal business name is required' })}
          />
          {errors.legalBusinessName && <p className="text-red-500 text-sm mt-1">{errors.legalBusinessName.message}</p>}
        </div>

        <div>
          <label className="label">Doing Business as (DBA)</label>
          <input
            type="text"
            className="input-field"
            {...register('doingBusinessAs')}
          />
        </div>

        {/* Shipping Address */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h3>
        </div>

        <div className="md:col-span-2">
          <label className="label">Pharmacy Shipping Address 1 *</label>
          <input
            type="text"
            className="input-field"
            {...register('shippingAddress.address1', { required: 'Address is required' })}
          />
          {errors.shippingAddress?.address1 && <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.address1.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="label">Pharmacy Shipping Address 2</label>
          <input
            type="text"
            className="input-field"
            {...register('shippingAddress.address2')}
          />
        </div>

        <div>
          <label className="label">City *</label>
          <input
            type="text"
            className="input-field"
            {...register('shippingAddress.city', { required: 'City is required' })}
          />
          {errors.shippingAddress?.city && <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.city.message}</p>}
        </div>

        <div>
          <label className="label">State *</label>
          <select
            className="input-field"
            {...register('shippingAddress.state', { required: 'State is required' })}
          >
            <option value="">Select State</option>
            {US_STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.shippingAddress?.state && <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.state.message}</p>}
        </div>

        <div>
          <label className="label">Zip Code *</label>
          <input
            type="text"
            className="input-field"
            {...register('shippingAddress.zipCode', { 
              required: 'Zip code is required',
              pattern: {
                value: /^\d{5}(-\d{4})?$/,
                message: 'Please enter a valid zip code'
              }
            })}
          />
          {errors.shippingAddress?.zipCode && <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.zipCode.message}</p>}
        </div>

        {/* Contact Information */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
        </div>

        <div>
          <label className="label">Pharmacy Phone *</label>
          <input
            type="tel"
            className="input-field"
            placeholder="XXX-XXX-XXXX"
            {...register('phone', {
              required: 'Phone is required',
              pattern: {
                value: /^\d{3}-\d{3}-\d{4}$/,
                message: 'Format: XXX-XXX-XXXX'
              }
            })}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="label">Pharmacy Fax</label>
          <input
            type="tel"
            className="input-field"
            placeholder="XXX-XXX-XXXX"
            {...register('fax', {
              pattern: {
                value: /^\d{3}-\d{3}-\d{4}$/,
                message: 'Format: XXX-XXX-XXXX'
              }
            })}
          />
          {errors.fax && <p className="text-red-500 text-sm mt-1">{errors.fax.message}</p>}
        </div>

        <div>
          <label className="label">Timezone *</label>
          <select
            className="input-field"
            {...register('timezone', { required: 'Timezone is required' })}
          >
            <option value="">Select Timezone</option>
            {TIMEZONES.map(tz => (
              <option key={tz} value={tz}>{tz.replace('America/', '')}</option>
            ))}
          </select>
          {errors.timezone && <p className="text-red-500 text-sm mt-1">{errors.timezone.message}</p>}
        </div>

        {/* Business Identification */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Identification</h3>
        </div>

        <div>
          <label className="label">Federal EIN *</label>
          <input
            type="text"
            className="input-field"
            placeholder="XX-XXXXXXX"
            {...register('federalEIN', { 
              required: 'Federal EIN is required',
              pattern: {
                value: /^\d{2}-\d{7}$/,
                message: 'Format: XX-XXXXXXX'
              }
            })}
          />
          {errors.federalEIN && <p className="text-red-500 text-sm mt-1">{errors.federalEIN.message}</p>}
        </div>

        <div>
          <label className="label">State Tax ID</label>
          <input
            type="text"
            className="input-field"
            {...register('stateTaxID')}
          />
        </div>

        <div>
          <label className="label">Global Location Number (GLN) *</label>
          <input
            type="text"
            className="input-field"
            {...register('globalLocationNumber', { 
              required: 'GLN is required',
              pattern: {
                value: /^\d{13}$/,
                message: 'GLN must be 13 digits'
              }
            })}
          />
          {errors.globalLocationNumber && <p className="text-red-500 text-sm mt-1">{errors.globalLocationNumber.message}</p>}
        </div>

        {/* Mailing Address Checkbox */}
        <div className="md:col-span-2 mt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('isMailingSameAsShipping')}
            />
            <span className="text-gray-700">Click if Pharmacy Mailing Information is same as Pharmacy Shipping Information</span>
          </label>
        </div>

        {/* Mailing Address (Conditional) */}
        {!isMailingSameAsShipping && (
          <>
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Mailing Address</h3>
            </div>

            <div className="md:col-span-2">
              <label className="label">Pharmacy Mailing Address 1 *</label>
              <input
                type="text"
                className="input-field"
                {...register('mailingAddress.address1', { 
                  required: !isMailingSameAsShipping && 'Mailing address is required' 
                })}
              />
              {errors.mailingAddress?.address1 && <p className="text-red-500 text-sm mt-1">{errors.mailingAddress.address1.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="label">Pharmacy Mailing Address 2</label>
              <input
                type="text"
                className="input-field"
                {...register('mailingAddress.address2')}
              />
            </div>

            <div>
              <label className="label">City *</label>
              <input
                type="text"
                className="input-field"
                {...register('mailingAddress.city', { 
                  required: !isMailingSameAsShipping && 'Mailing city is required' 
                })}
              />
              {errors.mailingAddress?.city && <p className="text-red-500 text-sm mt-1">{errors.mailingAddress.city.message}</p>}
            </div>

            <div>
              <label className="label">State *</label>
              <select
                className="input-field"
                {...register('mailingAddress.state', { 
                  required: !isMailingSameAsShipping && 'Mailing state is required' 
                })}
              >
                <option value="">Select State</option>
                {US_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.mailingAddress?.state && <p className="text-red-500 text-sm mt-1">{errors.mailingAddress.state.message}</p>}
            </div>

            <div>
              <label className="label">Zip Code *</label>
              <input
                type="text"
                className="input-field"
                {...register('mailingAddress.zipCode', {
                  required: !isMailingSameAsShipping && 'Mailing zip code is required',
                  pattern: {
                    value: /^\d{5}(-\d{4})?$/,
                    message: 'Please enter a valid zip code'
                  }
                })}
              />
              {errors.mailingAddress?.zipCode && <p className="text-red-500 text-sm mt-1">{errors.mailingAddress.zipCode.message}</p>}
            </div>
          </>
        )}

        {/* Account Credentials */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Credentials</h3>
        </div>

        <div>
          <label className="label">Email Address *</label>
          <input
            type="email"
            className="input-field"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Please enter a valid email'
              }
            })}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label">Password *</label>
          <input
            type="password"
            className="input-field"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              },
              validate: {
                hasUppercase: value => /[A-Z]/.test(value) || 'Must contain at least one uppercase letter',
                hasLowercase: value => /[a-z]/.test(value) || 'Must contain at least one lowercase letter',
                hasNumber: value => /[0-9]/.test(value) || 'Must contain at least one number',
                hasSpecial: value => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Must contain at least one special character'
              }
            })}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="label">Confirm Password *</label>
          <input
            type="password"
            className="input-field"
            {...register('confirmPassword', {
              required: 'Please confirm password',
              validate: value => {
                const password = watch('password');
                return value === password || 'Passwords do not match';
              }
            })}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          className="btn-primary px-8"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </form>
  );
};

export default Step1;