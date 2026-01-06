import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Step1 from '../components/registration/Step1.jsx';
import Step2 from '../components/registration/Step2.jsx';
import Step3 from '../components/registration/Step3.jsx';
import Step4 from '../components/registration/Step4.jsx';
import Step5 from '../components/registration/Step5.jsx';
import Step6 from '../components/registration/Step6.jsx';
import Step7 from '../components/registration/Step7.jsx';
import DocumentUpload from '../components/registration/DocumentUpload.jsx';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const { register, updateRegistrationData, registrationData, clearRegistrationData } = useAuth();
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: 'Pharmacy Information' },
    { number: 2, title: 'Pharmacy Owner' },
    { number: 3, title: 'Primary Contact' },
    { number: 4, title: 'Pharmacy License' },
    { number: 5, title: 'Pharmacy Questions' },
    { number: 6, title: 'Referral Information' },
    { number: 7, title: 'Review & Submit' },
  ];

  const handleStepSubmit = (stepNumber, data) => {
    updateRegistrationData(`step${stepNumber}`, data);
    
    if (stepNumber === 7) {
      // On final step, show confirmation and prepare for submission
      return;
    }
    
    setCurrentStep(stepNumber + 1);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      // Prepare final data
      const formData = {
        email: registrationData.step1.email,
        password: registrationData.step1.password,
        ...registrationData
      };

      // Remove password from step1 for security
      const { password, ...step1WithoutPassword } = registrationData.step1;
      formData.step1 = step1WithoutPassword;

      await register(formData);
      setShowDocumentUpload(true);
      clearRegistrationData();
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentsUploaded = () => {
    navigate('/pending-verification');
  };

  const renderStep = () => {
    if (showDocumentUpload) {
      return <DocumentUpload onComplete={handleDocumentsUploaded} />;
    }

    switch (currentStep) {
      case 1:
        return <Step1 
          onSubmit={(data) => handleStepSubmit(1, data)} 
          loading={loading} 
          initialData={registrationData.step1}
        />;
      case 2:
        return <Step2 
          onSubmit={(data) => handleStepSubmit(2, data)} 
          loading={loading}
          initialData={registrationData.step2}
        />;
      case 3:
        return <Step3 
          onSubmit={(data) => handleStepSubmit(3, data)} 
          loading={loading}
          initialData={registrationData.step3}
        />;
      case 4:
        return <Step4 
          onSubmit={(data) => handleStepSubmit(4, data)} 
          loading={loading}
          initialData={registrationData.step4}
        />;
      case 5:
        return <Step5 
          onSubmit={(data) => handleStepSubmit(5, data)} 
          loading={loading}
          initialData={registrationData.step5}
        />;
      case 6:
        return <Step6 
          onSubmit={(data) => handleStepSubmit(6, data)} 
          loading={loading}
          initialData={registrationData.step6}
        />;
      case 7:
        return <Step7 
          onSubmit={handleFinalSubmit}
          loading={loading}
          registrationData={registrationData}
        />;
      default:
        return null;
    }
  };

  if (showDocumentUpload) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {renderStep()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.number ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.number}
                </div>
                <span className="text-xs mt-2 text-gray-600">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-primary-600 -translate-y-1/2 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="step-container">
          {renderStep()}
        </div>

        {/* Navigation */}
        {currentStep > 1 && currentStep < 8 && (
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (currentStep < 7) {
                  // For steps 1-6, continue to next step
                  // The actual data saving happens in individual step components
                  setCurrentStep(currentStep + 1);
                }
              }}
              className="btn-primary px-8"
              disabled={loading}
            >
              Continue to Step {currentStep + 1}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;