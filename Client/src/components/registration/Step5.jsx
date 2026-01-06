import { useForm } from 'react-hook-form';

const ENTERPRISE_TYPES = ['Partnership', 'Corporation', 'Sole Proprietor', 'LLC'];
const PRIMARY_WHOLESALERS = ['AmeriSource-Bergen', 'Cardinal', 'Cencora', 'McKesson', 'Other'];
const PHARMACY_TYPES = [
  'Retail Pharmacy',
  'Closed Door Pharmacy',
  'Hospital Pharmacy',
  'Repackager',
  'Surgical Center Pharmacy',
  'Clinical Pharmacy',
  'Nursing Home Pharmacy',
  'Long Term Care Pharmacy',
  'Other'
];
const PHARMACY_SOFTWARE = [
  'Abacus',
  'AdvanceNet Health Solutions, Inc',
  'Apothesoft-Rx',
  'BestRx Pharmacy Solutions',
  'CarePoint',
  'Datascan',
  'Digital Rx',
  'EnterpriseRx by Mckesson',
  'FrameworkLTC',
  'FSI Pharmacy Management System',
  'Health Business Systems (HBS)',
  'Helix Pharmacy System',
  'Liberty Software',
  'Micro Merchant Systems, Inc',
  'New Leaf Rx by KeyCentrix',
  'Outcomes',
  'PDX Pharmacy System',
  'PharmacyRx - Mckesson',
  'Pharmaserv by McKesson',
  'PioneerRX',
  'PKonRx By SRS Pharmacy Systems',
  'PrimeRX',
  'PROscript 2000 by Prodigy Data Systems',
  'QS/1',
  'QuickScript by Cost Effective Computers',
  'Retail Management Solutions',
  'RS Software',
  'Rx3000 Outpatient Pharmacy Management System',
  'RxMaster Pharmacy Systems',
  'ScriptPro',
  'Speed Script and Speed Script LTC',
  'SuiteRx',
  'VIP Pharmacy Systems',
  'Visual Superscript by DDA Enterprises Inc',
  'WinRx by Computer-Rx',
  'Other'
];
const LOCATION_COUNTS = Array.from({ length: 20 }, (_, i) => i + 1);

const Step5 = ({ onSubmit, loading, initialData }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData?.pharmacyInfo || {}
  });
  
  const primaryWholesaler = watch('primaryWholesaler');
  const pharmacySoftware = watch('pharmacySoftware');
  const secondaryWholesaler = watch('secondaryWholesaler');

  const handleFormSubmit = (data) => {
    // Wrap the data in pharmacyInfo object
    onSubmit({ pharmacyInfo: data });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="step-header">
        <h2 className="step-title">Pharmacy Business Information</h2>
        <p className="step-subtitle">Please provide additional business details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Enterprise Type *</label>
          <select
            className="input-field"
            {...register('enterpriseType', { required: 'Enterprise type is required' })}
          >
            <option value="">Select Type</option>
            {ENTERPRISE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.enterpriseType && <p className="text-red-500 text-sm mt-1">{errors.enterpriseType.message}</p>}
        </div>

        <div>
          <label className="label">Primary Wholesaler *</label>
          <select
            className="input-field"
            {...register('primaryWholesaler', { required: 'Primary wholesaler is required' })}
          >
            <option value="">Select Wholesaler</option>
            {PRIMARY_WHOLESALERS.map(wholesaler => (
              <option key={wholesaler} value={wholesaler}>{wholesaler}</option>
            ))}
          </select>
          {errors.primaryWholesaler && <p className="text-red-500 text-sm mt-1">{errors.primaryWholesaler.message}</p>}
        </div>

        {primaryWholesaler === 'Other' && (
          <div className="md:col-span-2">
            <label className="label">Other Primary Wholesaler</label>
            <input
              type="text"
              className="input-field"
              {...register('primaryWholesalerOther')}
            />
          </div>
        )}

        <div>
          <label className="label">Secondary Wholesaler</label>
          <select
            className="input-field"
            {...register('secondaryWholesaler')}
          >
            <option value="">Select Wholesaler</option>
            {PRIMARY_WHOLESALERS.map(wholesaler => (
              <option key={wholesaler} value={wholesaler}>{wholesaler}</option>
            ))}
          </select>
        </div>

        {secondaryWholesaler === 'Other' && (
          <div className="md:col-span-2">
            <label className="label">Other Secondary Wholesaler</label>
            <input
              type="text"
              className="input-field"
              {...register('secondaryWholesalerOther')}
            />
          </div>
        )}

        <div>
          <label className="label">Type of Pharmacy *</label>
          <select
            className="input-field"
            {...register('pharmacyType', { required: 'Pharmacy type is required' })}
          >
            <option value="">Select Type</option>
            {PHARMACY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.pharmacyType && <p className="text-red-500 text-sm mt-1">{errors.pharmacyType.message}</p>}
        </div>

        <div>
          <label className="label">Pharmacy Software *</label>
          <select
            className="input-field"
            {...register('pharmacySoftware', { required: 'Pharmacy software is required' })}
          >
            <option value="">Select Software</option>
            {PHARMACY_SOFTWARE.map(software => (
              <option key={software} value={software}>{software}</option>
            ))}
          </select>
          {errors.pharmacySoftware && <p className="text-red-500 text-sm mt-1">{errors.pharmacySoftware.message}</p>}
        </div>

        {pharmacySoftware === 'Other' && (
          <div className="md:col-span-2">
            <label className="label">Other Pharmacy Software</label>
            <input
              type="text"
              className="input-field"
              {...register('pharmacySoftwareOther')}
            />
          </div>
        )}

        <div className="md:col-span-2">
          <label className="label">Hours Of Operation *</label>
          <textarea
            className="input-field"
            rows="3"
            placeholder="e.g., Monday-Friday: 9 AM - 6 PM, Saturday: 10 AM - 2 PM"
            {...register('hoursOfOperation', { required: 'Hours of operation are required' })}
          />
          {errors.hoursOfOperation && <p className="text-red-500 text-sm mt-1">{errors.hoursOfOperation.message}</p>}
        </div>

        <div>
          <label className="label">Number of Locations *</label>
          <select
            className="input-field"
            {...register('numberOfLocations', { 
              required: 'Number of locations is required',
              valueAsNumber: true
            })}
          >
            <option value="">Select Number</option>
            {LOCATION_COUNTS.map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
            <option value="20">20+</option>
          </select>
          {errors.numberOfLocations && <p className="text-red-500 text-sm mt-1">{errors.numberOfLocations.message}</p>}
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
          {loading ? 'Processing...' : 'Continue to Step 6'}
        </button>
      </div>
    </form>
  );
};

export default Step5;