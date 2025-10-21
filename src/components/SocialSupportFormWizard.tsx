import React, { useEffect } from 'react';
import { Box, Button, Container, LinearProgress, Typography, Step, StepLabel, Stepper } from '@mui/material';
import { SocialSupportWizardProvider } from '../context/SocialSupportWizardContext';
import { useSocialSupportWizard } from '../context/useSocialSupportWizard';
import PersonalInfoForm from './PersonalInfoForm';
import FamilyFinancialInfoForm from './FamilyFinancialInfoForm';
import SituationDescriptionsForm from './SituationDescriptionsForm';
import { getItem, setItem } from '../utils/localStorage.util';

// Define the structure for localStorage data (with date as string)
interface LocalStorageFormData {
  personalInfo: {
    name: string;
    nationalId: string;
    dateOfBirth: string; // Stored as string in localStorage
    gender: string;
    address: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
  } | null;
  familyFinancialInfo: {
    maritalStatus: string;
    dependents: number;
    employmentStatus: string;
    monthlyIncome: number;
    housingStatus: string;
  } | null;
  situationDescriptions: {
    currentFinancialSituation: string;
    employmentCircumstances: string;
    reasonForApplying: string;
  } | null;
}

// Wrapper component to provide the context
const SocialSupportFormWizardWithProvider: React.FC = () => {
  return (
    <SocialSupportWizardProvider>
      <SocialSupportFormWizard />
    </SocialSupportWizardProvider>
  );
};

const SocialSupportFormWizard: React.FC = () => {
  const { formData, updatePersonalInfo, updateFamilyFinancialInfo, updateSituationDescriptions, resetFormData } = useSocialSupportWizard();
  const [loading, setLoading] = React.useState(true);

  const steps = ['Personal Information', 'Family & Financial Info', 'Situation Descriptions'];

  // Determine the active step based on form completion
 const [activeStep, setActiveStep] = React.useState(0);
  const [hasLoaded, setHasLoaded] = React.useState(false);

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedData = getItem<LocalStorageFormData>('formData');
    if (savedData) {
      // Update the context with saved data
      if (savedData.personalInfo) {
        // Convert date string back to Date object if needed
        updatePersonalInfo({
          ...savedData.personalInfo,
          dateOfBirth: new Date(savedData.personalInfo.dateOfBirth) // Convert string back to Date
        });
      }
      if (savedData.familyFinancialInfo) {
        updateFamilyFinancialInfo(savedData.familyFinancialInfo);
      }
      if (savedData.situationDescriptions) {
        updateSituationDescriptions(savedData.situationDescriptions);
      }

      // Determine starting step based on saved data
      if (savedData.situationDescriptions) {
        setActiveStep(2); // If all forms are filled, start at the final step
      } else if (savedData.familyFinancialInfo) {
        setActiveStep(1); // If first two forms are filled, start at the second step
      } else if (savedData.personalInfo) {
        setActiveStep(0); // If only first form is filled, start at the first step
      }
    }
    setLoading(false);
    setHasLoaded(true);
  }, []);

  // Save form data to localStorage whenever it changes (after initial load)
  useEffect(() => {
    if (hasLoaded) { // Only save after the initial load is complete
      // Convert form data to localStorage format
      const localStorageData: LocalStorageFormData = {
        personalInfo: formData.personalInfo ? {
          ...formData.personalInfo,
          dateOfBirth: formData.personalInfo.dateOfBirth.toString() // Convert Date to string for storage
        } : null,
        familyFinancialInfo: formData.familyFinancialInfo,
        situationDescriptions: formData.situationDescriptions
      };
      setItem('formData', localStorageData);
    }
  }, [formData, hasLoaded]);

  const handlePersonalInfoSubmit = (data: {
    name: string;
    nationalId: string;
    dateOfBirth: Date;
    gender: string;
    address: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
  }) => {
    updatePersonalInfo(data);
    setActiveStep(1);
  };

  const handleFamilyFinancialInfoSubmit = (data: {
    maritalStatus: string;
    dependents: number;
    employmentStatus: string;
    monthlyIncome: number;
    housingStatus: string;
  }) => {
    updateFamilyFinancialInfo(data);
    setActiveStep(2); // Move to third step (situation descriptions)
  };

  const handleSituationDescriptionsSubmit = (data: {
    currentFinancialSituation: string;
    employmentCircumstances: string;
    reasonForApplying: string;
  }) => {
    updateSituationDescriptions(data);
    setActiveStep(3); // Move to final step (completed)
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    resetFormData();
    setActiveStep(0);
    // Clear saved data from localStorage
    localStorage.removeItem('formData');
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <PersonalInfoForm
            onSubmit={handlePersonalInfoSubmit}
            defaultValues={formData.personalInfo || undefined}
          />
        );
      case 1:
        return (
          <FamilyFinancialInfoForm
            onSubmit={handleFamilyFinancialInfoSubmit}
            defaultValues={formData.familyFinancialInfo || undefined}
          />
        );
      case 2:
        return (
          <SituationDescriptionsForm
            onSubmit={handleSituationDescriptionsSubmit}
            onBack={() => setActiveStep(1)}
            defaultValues={formData.situationDescriptions || undefined}
          />
        );
      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" gutterBottom>
              Application Submitted Successfully!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Thank you for completing the application form. Your information has been saved.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="contained" color="primary" onClick={handleReset}>
                Start New Application
              </Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        px: { xs: 1, sm: 2, md: 0 },
        mt: { xs: 2, sm: 3, md: 4 },
        mb: { xs: 2, sm: 3, md: 4 }
      }}
      role="main"
      aria-label="Social Support Application Form Wizard"
    >
      <Box>
        {/* Skip link for screen readers */}
        <a
          href="#form-content"
          className="skip-link"
          style={{
            position: 'absolute',
            left: '-10000px',
            top: 'auto',
            width: '1px',
            height: '1px',
            overflow: 'hidden'
          }}
        >
          Skip to main content
        </a>
        
        {/* Progress bar */}
        <Box
          sx={{ mb: { xs: 2, sm: 3 } }}
          role="region"
          aria-label="Application progress steps"
        >
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            aria-label="Application steps navigation"
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                    }
                  }}
                  aria-current={index === activeStep ? 'step' : undefined}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Progress indicator */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 2 }
          }}
          role="progressbar"
          aria-valuenow={activeStep + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-label={`Step ${activeStep + 1} of ${steps.length}`}
        >
          <Box sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}>
            <LinearProgress
              variant="determinate"
              value={(activeStep / steps.length) * 100}
              sx={{ height: { xs: 6, sm: 8 }, borderRadius: 4 }}
              aria-hidden="true"
            />
          </Box>
          <Typography
            variant="body2"
            sx={{
              ml: { xs: 0, sm: 2 },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Step {activeStep + 1} of {steps.length}
          </Typography>
        </Box>

        {/* Form content */}
        <Box id="form-content" tabIndex={-1}>
          {renderStepContent()}
        </Box>

        {/* Navigation buttons */}
        {activeStep < 3 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              mt: 3,
              gap: { xs: 1, sm: 2 }
            }}
            role="group"
            aria-label="Form navigation buttons"
          >
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 1 }
              }}
              aria-label="Go to previous step"
            >
              Back
            </Button>
            {activeStep === 1 && (
              <Button
                variant="contained"
                onClick={() => setActiveStep(2)}
                color="primary"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.5, sm: 1 }
                }}
                aria-label="Go to next step"
              >
                Next
              </Button>
            )}
            {activeStep === 0 && (
              <Button
                variant="contained"
                onClick={() => setActiveStep(1)}
                color="primary"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.5, sm: 1 }
                }}
                aria-label="Go to next step"
              >
                Next
              </Button>
            )}
            {activeStep === 2 && (
              <Button
                variant="contained"
                onClick={() => setActiveStep(3)}
                color="primary"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.5, sm: 1 }
                }}
                aria-label="Complete application"
              >
                Submit Application
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SocialSupportFormWizardWithProvider;