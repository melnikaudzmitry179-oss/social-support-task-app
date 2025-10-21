import React, { useState, useEffect } from 'react';
import { Box, Button, Container, LinearProgress, Typography, Step, StepLabel, Stepper } from '@mui/material';
import PersonalInfoForm from './PersonalInfoForm';
import FamilyFinancialInfoForm from './FamilyFinancialInfoForm';
import { getItem, setItem } from '../utils/localStorage.util';
import type { FormData as PersonalInfoData } from './PersonalInfoForm';
import type { FormData as FamilyFinancialInfoData } from './FamilyFinancialInfoForm';

interface FormData {
  personalInfo: PersonalInfoData | null;
  familyFinancialInfo: FamilyFinancialInfoData | null;
}

const FormWizard: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: null,
    familyFinancialInfo: null
  });
  const [loading, setLoading] = useState(true);

  const steps = ['Personal Information', 'Family & Financial Info'];

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedData = getItem<FormData>('formData');
    if (savedData) {
      setFormData(savedData);
      if (savedData.familyFinancialInfo) {
        setActiveStep(1); // If both forms are filled, start at the second step
      }
    }
    setLoading(false);
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      setItem('formData', formData);
    }
  }, [formData, loading]);

  const handlePersonalInfoSubmit = (data: PersonalInfoData) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: data
    }));
    setActiveStep(1);
  };

  const handleFamilyFinancialInfoSubmit = (data: FamilyFinancialInfoData) => {
    setFormData(prev => ({
      ...prev,
      familyFinancialInfo: data
    }));
    setActiveStep(2); // Move to final step (completed)
  };

 const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setFormData({
      personalInfo: null,
      familyFinancialInfo: null
    });
    setActiveStep(0);
    // Clear saved data from localStorage
    localStorage.removeItem('formData');
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />
        );
      case 1:
        return (
          <FamilyFinancialInfoForm onSubmit={handleFamilyFinancialInfoSubmit} />
        );
      case 2:
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
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Progress bar */}
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Progress indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={(activeStep / steps.length) * 100} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          <Typography variant="body2" sx={{ ml: 2 }}>
            Step {activeStep + 1} of {steps.length}
          </Typography>
        </Box>

        {/* Form content */}
        <Box>
          {renderStepContent()}
        </Box>

        {/* Navigation buttons */}
        {activeStep < 2 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button 
              disabled={activeStep === 0} 
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            {activeStep === 1 && (
              <Button 
                variant="contained" 
                onClick={() => setActiveStep(2)}
                color="primary"
              >
                Complete Application
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default FormWizard;