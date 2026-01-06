import { useForm } from 'react-hook-form';

const Step2 = ({ onSubmit, loading, initialData }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: initialData?.owner || {}
  });
  
  const ownerEmail = watch('email');
  const confirmEmail = watch('confirmEmail');

  const handleFormSubmit = (data) => {
    // Remove confirmEmail before submitting
    const { confirmEmail, ...ownerData } = data;
    // Wrap the data in owner object
    onSubmit({ owner: ownerData });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="step-header">
        <h2 className="step-title">Pharmacy Owner Information</h2>
        <p className="step-subtitle">Please provide pharmacy owner details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Owner First Name *</label>
          <input
            type="text"
            className="input-field"
            {...register('firstName', { required: 'First name is required' })}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
        </div>

        <div>
          <label className="label">Owner Last Name *</label>
          <input
            type="text"
            className="input-field"
            {...register('lastName', { required: 'Last name is required' })}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
        </div>

        <div>
          <label className="label">Mobile Number *</label>
          <input
            type="tel"
            className="input-field"
            placeholder="XXX-XXX-XXXX"
            {...register('mobile', {
              required: 'Mobile number is required',
              pattern: {
                value: /^\d{3}-\d{3}-\d{4}$/,
                message: 'Format: XXX-XXX-XXXX'
              }
            })}
          />
          {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
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
          <label className="label">Confirm Email Address *</label>
          <input
            type="email"
            className="input-field"
            {...register('confirmEmail', {
              required: 'Please confirm email',
              validate: value => value === ownerEmail || 'Emails do not match'
            })}
          />
          {errors.confirmEmail && <p className="text-red-500 text-sm mt-1">{errors.confirmEmail.message}</p>}
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
          {loading ? 'Processing...' : 'Continue to Step 3'}
        </button>
      </div>
    </form>
  );
};

export default Step2;