import { useForm } from 'react-hook-form';

const Step4 = ({ onSubmit, loading, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData?.licenses || {}
  });

  const handleFormSubmit = (data) => {
    // Wrap the data in licenses object
    onSubmit({ licenses: data });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="step-header">
        <h2 className="step-title">Pharmacy License Information</h2>
        <p className="step-subtitle">Please provide your pharmacy license details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">DEA # *</label>
          <input
            type="text"
            className="input-field"
            {...register('deaNumber', { required: 'DEA number is required' })}
          />
          {errors.deaNumber && <p className="text-red-500 text-sm mt-1">{errors.deaNumber.message}</p>}
        </div>

        <div>
          <label className="label">DEA Expiration Date *</label>
          <input
            type="date"
            className="input-field"
            {...register('deaExpiration', { 
              required: 'DEA expiration date is required',
              validate: value => {
                const date = new Date(value);
                return date > new Date() || 'Expiration date must be in the future';
              }
            })}
          />
          {errors.deaExpiration && <p className="text-red-500 text-sm mt-1">{errors.deaExpiration.message}</p>}
        </div>

        <div>
          <label className="label">State License Number *</label>
          <input
            type="text"
            className="input-field"
            {...register('stateLicenseNumber', { required: 'State license number is required' })}
          />
          {errors.stateLicenseNumber && <p className="text-red-500 text-sm mt-1">{errors.stateLicenseNumber.message}</p>}
        </div>

        <div>
          <label className="label">State License Expiration Date *</label>
          <input
            type="date"
            className="input-field"
            {...register('stateLicenseExpiration', { 
              required: 'State license expiration date is required',
              validate: value => {
                const date = new Date(value);
                return date > new Date() || 'Expiration date must be in the future';
              }
            })}
          />
          {errors.stateLicenseExpiration && <p className="text-red-500 text-sm mt-1">{errors.stateLicenseExpiration.message}</p>}
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
          {loading ? 'Processing...' : 'Continue to Step 5'}
        </button>
      </div>
    </form>
  );
};

export default Step4;