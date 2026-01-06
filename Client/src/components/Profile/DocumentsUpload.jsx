import { useState } from 'react';

const DocumentsUpload = ({ profile, onUpdate, loading }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});

  const documentTypes = [
    { 
      id: 'deaLicense', 
      name: 'DEA License', 
      description: 'Drug Enforcement Administration license',
      required: true 
    },
    { 
      id: 'stateLicense', 
      name: 'State License', 
      description: 'State pharmacy license',
      required: true 
    },
    { 
      id: 'businessLicense', 
      name: 'Business License', 
      description: 'Business operation license',
      required: true 
    },
    { 
      id: 'einDocument', 
      name: 'EIN Document', 
      description: 'Employer Identification Number document',
      required: true 
    },
    { 
      id: 'w9Form', 
      name: 'W-9 Form', 
      description: 'Tax form W-9',
      required: true 
    },
    { 
      id: 'voidedCheck', 
      name: 'Voided Check', 
      description: 'Voided check for bank verification',
      required: true 
    },
    { 
      id: 'additionalDoc1', 
      name: 'Additional Document 1', 
      description: 'Any additional supporting document',
      required: false 
    },
    { 
      id: 'additionalDoc2', 
      name: 'Additional Document 2', 
      description: 'Any additional supporting document',
      required: false 
    }
  ];

  const handleFileChange = async (e, documentId) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Maximum size is 10MB.');
      return;
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload PDF, JPG, or PNG files only.');
      return;
    }

    setUploading(true);
    setProgress(prev => ({ ...prev, [documentId]: 0 }));

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = (prev[documentId] || 0) + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...prev, [documentId]: 100 };
        }
        return { ...prev, [documentId]: newProgress };
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append(documentId, file);

      // Add other document fields
      documentTypes.forEach(doc => {
        if (doc.id !== documentId && profile.documents?.[doc.id]) {
          formData.append(doc.id, profile.documents[doc.id]);
        }
      });

      const response = await fetch('/api/auth/upload-documents-profile', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      clearInterval(interval);
      setProgress(prev => ({ ...prev, [documentId]: 100 }));

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      
      // Update local state
      if (onUpdate) {
        await onUpdate({
          documents: {
            ...profile.documents,
            [documentId]: data.documents[documentId]
          }
        });
      }

      setTimeout(() => {
        setProgress(prev => ({ ...prev, [documentId]: undefined }));
      }, 1000);

      alert(`${documentTypes.find(d => d.id === documentId)?.name} uploaded successfully!`);

    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload: ${error.message}`);
      setProgress(prev => ({ ...prev, [documentId]: undefined }));
    } finally {
      setUploading(false);
    }
  };

  const getFileTypeIcon = (filename) => {
    if (!filename) return '📄';
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return '📕';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return '🖼️';
    return '📄';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Upload Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              {profile.documentsUploaded 
                ? 'All documents have been uploaded. Admin will review them soon.'
                : 'Please upload all required documents to complete your registration.'}
            </p>
          </div>
        </div>
      </div>

      {/* Document Status */}
      {profile.documents?.status && (
        <div className={`p-4 rounded-lg ${
          profile.documents.status === 'approved' ? 'bg-green-50 border border-green-200' :
          profile.documents.status === 'rejected' ? 'bg-red-50 border border-red-200' :
          'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {profile.documents.status === 'approved' && '✅'}
              {profile.documents.status === 'rejected' && '❌'}
              {profile.documents.status === 'pending' && '⏳'}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                profile.documents.status === 'approved' ? 'text-green-800' :
                profile.documents.status === 'rejected' ? 'text-red-800' :
                'text-yellow-800'
              }`}>
                Document Status: {profile.documents.status.toUpperCase()}
              </p>
              {profile.documents.reviewNotes && (
                <p className="text-sm text-gray-600 mt-1">
                  Admin Notes: {profile.documents.reviewNotes}
                </p>
              )}
              {profile.documents.reviewedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Reviewed on: {new Date(profile.documents.reviewedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documentTypes.map((doc) => (
          <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {doc.name}
                  {doc.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
                <p className="text-sm text-gray-500">{doc.description}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {doc.required ? 'Required' : 'Optional'}
              </span>
            </div>

            {/* Current File */}
            {profile.documents?.[doc.id] && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-lg mr-2">
                    {getFileTypeIcon(profile.documents[doc.id])}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {profile.documents[doc.id].split('/').pop()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(profile.documents.uploadedAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {progress[doc.id] !== undefined && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{progress[doc.id]}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress[doc.id]}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div>
              <label className="block">
                <span className="sr-only">Choose file</span>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, doc.id)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  accept=".pdf,.jpg,.jpeg,.png"
                  disabled={uploading}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Accepted: PDF, JPG, PNG (Max 10MB)
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload All Button (Optional) */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Bulk Upload</p>
            <p className="text-sm text-gray-500">Upload multiple documents at once</p>
          </div>
          <button
            type="button"
            onClick={() => alert('Bulk upload feature coming soon')}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            Upload Multiple Files
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentsUpload;