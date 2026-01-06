import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const DOCUMENTS = [
  { id: 'deaLicense', label: 'DEA License *', required: true },
  { id: 'stateLicense', label: 'State License *', required: true },
  { id: 'businessLicense', label: 'Business License *', required: true },
  { id: 'einDocument', label: 'EIN Document *', required: true },
  { id: 'w9Form', label: 'W-9 Form *', required: true },
  { id: 'voidedCheck', label: 'Voided Check *', required: true },
  { id: 'additionalDoc1', label: 'Additional Document 1' },
  { id: 'additionalDoc2', label: 'Additional Document 2' },
];

const DocumentUpload = ({ onComplete }) => {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const { uploadDocuments } = useAuth();

  const handleFileChange = (fieldId, file) => {
    setFiles(prev => ({
      ...prev,
      [fieldId]: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check required files
      const requiredFiles = DOCUMENTS.filter(doc => doc.required);
      for (const doc of requiredFiles) {
        if (!files[doc.id]) {
          throw new Error(`Please upload ${doc.label}`);
        }
      }

      const formData = new FormData();
      Object.entries(files).forEach(([fieldId, file]) => {
        if (file) {
          formData.append(fieldId, file);
        }
      });

      await uploadDocuments(formData);
      onComplete();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="step-title">Upload Required Documents</h2>
        <p className="step-subtitle">
          Registration submitted successfully! Now please upload the required documents for verification.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3">Document Requirements</h3>
          <ul className="list-disc pl-5 space-y-2 text-blue-700">
            <li>All documents must be clear, legible, and valid</li>
            <li>Accepted formats: JPG, PNG, PDF, DOC, DOCX</li>
            <li>Maximum file size: 5MB per document</li>
            <li>Documents marked with * are required</li>
            <li>Verification typically takes 1-2 business days</li>
          </ul>
        </div>

        <div className="space-y-6">
          {DOCUMENTS.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{doc.label}</h3>
                  {doc.required && <span className="text-red-500 ml-2">* Required</span>}
                </div>
                {files[doc.id] && (
                  <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    ✓ Selected
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div>
                  <input
                    type="file"
                    id={doc.id}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(doc.id, e.target.files[0])}
                  />
                  <label
                    htmlFor={doc.id}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
                
                {files[doc.id] && (
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {files[doc.id].name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(files[doc.id].size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {uploadProgress[doc.id] !== undefined && (
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${uploadProgress[doc.id]}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Uploading: {uploadProgress[doc.id]}%
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary px-8"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Submit Documents'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload;