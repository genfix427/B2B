import { useForm } from 'react-hook-form';

const HEAR_ABOUT_US_OPTIONS = [
  'Google Search',
  'Social Media',
  'Referral',
  'Email Newsletter',
  'Industry Event',
  'Other'
];

const Step6 = ({ onSubmit, loading, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData?.referralInfo || {}
  });

  const handleFormSubmit = (data) => {
    // Wrap the data in referralInfo object
    onSubmit({ referralInfo: data });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="step-header">
        <h2 className="step-title">Referral Information</h2>
        <p className="step-subtitle">Tell us how you heard about us</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Promo Code</label>
          <input
            type="text"
            className="input-field"
            {...register('promoCode')}
          />
        </div>

        <div>
          <label className="label">How did you hear about us? *</label>
          <select
            className="input-field"
            {...register('hearAboutUs', { required: 'Please tell us how you heard about us' })}
          >
            <option value="">Select Option</option>
            {HEAR_ABOUT_US_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.hearAboutUs && <p className="text-red-500 text-sm mt-1">{errors.hearAboutUs.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="label">Referred by</label>
          <input
            type="text"
            className="input-field"
            placeholder="Name of person who referred you"
            {...register('referredBy')}
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('acceptedTerms', { 
                required: 'You must accept the terms and conditions'
              })}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I accept the terms and conditions of the MatchRX User Agreement.
              {errors.acceptedTerms && <span className="text-red-500 block mt-1">{errors.acceptedTerms.message}</span>}
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Back
        </button>
        <button
          type="submit"
          className="btn-primary px-8"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Continue to Step 7'}
        </button>
      </div>
    </form>
  );
};

export default Step6;