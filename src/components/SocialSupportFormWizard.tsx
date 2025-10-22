import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Container,
  LinearProgress,
  Typography,
  Step,
  StepLabel,
  Stepper,
  Snackbar,
  Alert,
} from "@mui/material";
import { SocialSupportWizardProvider } from "../context/SocialSupportWizardContext";
import { useSocialSupportWizard } from "../context/useSocialSupportWizard";
import PersonalInfoForm from "./PersonalInfoForm";
import FamilyFinancialInfoForm from "./FamilyFinancialInfoForm";
import SituationDescriptionsForm from "./SituationDescriptionsForm";
import type { FormRef } from "../types/formTypes";
import { getItem, setItem } from "../utils/localStorage.util";
import {
  validatePersonalInfo,
  validateFamilyFinancialInfo,
} from "../utils/validation.util";

// Removed unused import: import { submitFormData } from '../api/formService';

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
  const { t } = useTranslation();
  const {
    formData,
    updatePersonalInfo,
    updateFamilyFinancialInfo,
    updateSituationDescriptions,
    resetFormData,
  } = useSocialSupportWizard();
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error" | "warning" | "info"
  >("success");

  // Refs for the form components to trigger validation and save
  const personalInfoFormRef = React.useRef<FormRef>(null);
  const familyFinancialInfoFormRef = React.useRef<FormRef>(null);
  const situationDescriptionsFormRef = React.useRef<FormRef>(null);

  const steps = [
    t("socialSupportFormWizard.stepLabels.0"),
    t("socialSupportFormWizard.stepLabels.1"),
    t("socialSupportFormWizard.stepLabels.2"),
  ];

  // Determine the active step based on form completion
  const [activeStep, setActiveStep] = React.useState(0);
  const [hasLoaded, setHasLoaded] = React.useState(false);

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedData = getItem<LocalStorageFormData>("formData");
    if (savedData) {
      // Update the context with saved data
      if (savedData.personalInfo) {
        // Convert date string back to Date object if needed
        updatePersonalInfo({
          ...savedData.personalInfo,
          dateOfBirth: new Date(savedData.personalInfo.dateOfBirth), // Convert string back to Date
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
    if (hasLoaded) {
      // Only save after the initial load is complete
      // Convert form data to localStorage format
      const localStorageData: LocalStorageFormData = {
        personalInfo: formData.personalInfo
          ? {
              ...formData.personalInfo,
              dateOfBirth: formData.personalInfo.dateOfBirth.toString(), // Convert Date to string for storage
            }
          : null,
        familyFinancialInfo: formData.familyFinancialInfo,
        situationDescriptions: formData.situationDescriptions,
      };
      setItem("formData", localStorageData);
    }
  }, [formData, hasLoaded]);

  const handleSubmitAllForms = async () => {

    try {
      // Validate the current (and only mounted) form via its ref
      const isSituationDescriptionsValid =
        await situationDescriptionsFormRef.current?.submitForm();

      // Programmatically validate data for other forms from context
      const isPersonalInfoValid = await validatePersonalInfo(
        formData.personalInfo || {},
        t
      );
      const isFamilyFinancialInfoValid = await validateFamilyFinancialInfo(
        formData.familyFinancialInfo || {},
        t
      );

      // Check if all forms are valid
      if (
        !isPersonalInfoValid ||
        !isFamilyFinancialInfoValid ||
        !isSituationDescriptionsValid
      ) {
        setSubmitError(
          t("socialSupportFormWizard.validationError") ||
            "Please correct errors in the forms before submitting."
        );
        // Move to the step with validation errors so user can see them
        if (!isPersonalInfoValid) {
          setActiveStep(0);
        } else if (!isFamilyFinancialInfoValid) {
          setActiveStep(1);
        } else if (!isSituationDescriptionsValid) {
          setActiveStep(2); // Stay on the current step where the error occurred
        }
        return;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSubmitError(
        t("socialSupportFormWizard.validationError") ||
          "Please correct errors in the forms before submitting."
          
      );
      return;
    }

    // Prepare the form data to submit, converting date to string
    // At this point, all form data should be available since user has completed all steps
    const fullFormData = {
      personalInfo: {
        ...formData.personalInfo,
        dateOfBirth: formData.personalInfo.dateOfBirth.toString(),
      },
      familyFinancialInfo: formData.familyFinancialInfo,
      situationDescriptions: formData.situationDescriptions,
    };
    console.log("Full Form Data:", fullFormData);

    // Verify that all required data is present before submitting
    if (
      !fullFormData.personalInfo ||
      !fullFormData.familyFinancialInfo ||
      !fullFormData.situationDescriptions
    ) {
      setSubmitError(
        t("socialSupportFormWizard.missingDataError") ||
          "Some required form data is missing."
      );
      return;
    }

    // Skip backend submission and complete the flow directly
    setIsSubmitting(true);
    setSubmitError(null);

    // Complete the submission flow immediately
    setActiveStep(3); // Move to final step (completed)

    // Set submitting to false immediately since we're not actually submitting to a backend
    setIsSubmitting(false);

    // Original submission code (commented out)
    // try {
    //   setIsSubmitting(true);
    //   setSubmitError(null);
    //   await submitFormData(fullFormData);
    //   setActiveStep(3); // Move to final step (completed)
    // } catch (error) {
    //   setSubmitError(t('socialSupportFormWizard.submitError') || 'Failed to submit form. Please try again.');
    //   console.error('Error submitting form:', error);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  const handleBack = () => {
    setSubmitError(null); // Clear error when navigating away
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    resetFormData();
    setActiveStep(0);
    setSubmitError(null); // Clear error when resetting
    // Clear saved data from localStorage
    localStorage.removeItem("formData");
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            {submitError && (
              <Box sx={{ mb: 2 }}>
                <Alert severity="error" onClose={() => setSubmitError(null)}>
                  {submitError}
                </Alert>
              </Box>
            )}
            <PersonalInfoForm
              ref={personalInfoFormRef}
              defaultValues={formData.personalInfo || undefined}
            />
          </>
        );
      case 1:
        return (
          <>
            {submitError && (
              <Box sx={{ mb: 2 }}>
                <Alert severity="error" onClose={() => setSubmitError(null)}>
                  {submitError}
                </Alert>
              </Box>
            )}
            <FamilyFinancialInfoForm
              ref={familyFinancialInfoFormRef}
              defaultValues={formData.familyFinancialInfo || undefined}
            />
          </>
        );
      case 2:
        return (
          <>
            {submitError && (
              <Box sx={{ mb: 2 }}>
                <Alert severity="error" onClose={() => setSubmitError(null)}>
                  {submitError}
                </Alert>
              </Box>
            )}
            <SituationDescriptionsForm
              ref={situationDescriptionsFormRef}
              defaultValues={formData.situationDescriptions || undefined}
            />
          </>
        );
      case 3:
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            {isSubmitting ? (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                  {t("socialSupportFormWizard.submitting")}
                </Typography>
                <LinearProgress sx={{ mt: 2 }} />
              </Box>
            ) : submitError ? (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" color="error" gutterBottom>
                  {t("socialSupportFormWizard.submitErrorTitle") ||
                    "Submission Error"}
                </Typography>
                <Typography variant="body1" color="error" sx={{ mb: 3 }}>
                  {submitError}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {setSubmitError(null); setActiveStep(2);}} // Go back to form to try again
                  >
                    {t("socialSupportFormWizard.tryAgain") || "Try Again"}
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="h4" gutterBottom>
                  {t("socialSupportFormWizard.applicationSubmitted")}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {t("socialSupportFormWizard.thankYouMessage")}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReset}
                  >
                    {t("socialSupportFormWizard.startNewApplication")}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ width: "100%", mt: 4 }}>
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
        mb: { xs: 2, sm: 3, md: 4 },
      }}
      role="main"
      aria-label={t("socialSupportFormWizard.title")}
    >
      <Box>
        {/* Skip link for screen readers */}
        <a
          href="#form-content"
          className="skip-link"
          style={{
            position: "absolute",
            left: "-1000px",
            top: "auto",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        >
          {t("skipToMainContent", "Skip to main content")}
        </a>

        {/* Progress bar */}
        <Box
          sx={{ mb: { xs: 2, sm: 3 } }}
          role="region"
          aria-label={t("socialSupportFormWizard.title")}
        >
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            aria-label={t("socialSupportFormWizard.title")}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                    },
                  }}
                  aria-current={index === activeStep ? "step" : undefined}
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
            display: "flex",
            alignItems: "center",
            mb: 2,
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 2 },
          }}
          role="progressbar"
          aria-valuenow={activeStep + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-label={`${t("socialSupportFormWizard.stepLabels.0")} ${
            activeStep + 1
          } ${t("of")} ${steps.length}`}
        >
          <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
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
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {t("socialSupportFormWizard.stepLabels.0")} {activeStep + 1}{" "}
            {t("of")} {steps.length}
          </Typography>
        </Box>

        {/* Form content */}
        <Box id="form-content" tabIndex={-1}>
          {renderStepContent()}
        </Box>

        {/* Navigation buttons */}

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            mt: 3,
            gap: { xs: 1, sm: 2 },
          }}
          role="group"
          aria-label={t("socialSupportFormWizard.title")}
        >
          {/* Show the general back button only for steps 1 and 2 (not for step 0) */}
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              variant="outlined"
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 1 },
              }}
              aria-label={t("socialSupportFormWizard.back")}
            >
              {t("socialSupportFormWizard.back")}
            </Button>
          )}
          {activeStep === 0 && (
            <Button
              variant="contained"
              onClick={() => {setSubmitError(null); setActiveStep(1);}}
              color="primary"
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 1 },
              }}
              aria-label={t("socialSupportFormWizard.next")}
            >
              {t("socialSupportFormWizard.next")}
            </Button>
          )}
          {activeStep === 1 && (
            <Button
              variant="contained"
              onClick={() => {setSubmitError(null); setActiveStep(2);}}
              color="primary"
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 1 },
              }}
              aria-label={t("socialSupportFormWizard.next")}
            >
              {t("socialSupportFormWizard.next")}
            </Button>
          )}

          {/* Save buttons for steps */}
          {activeStep === 0 && (
            <Button
              variant="contained"
              color="secondary"
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 1 },
              }}
              aria-label={t("personalInfoForm.save")}
              onClick={async () => {
                const isValid = await personalInfoFormRef.current?.submitForm();
                if (isValid) {
                  setSnackbarMessage(
                    t("personalInfoForm.save") +
                      " " +
                      t("socialSupportFormWizard.savedSuccessfully")
                  );
                  setSnackbarSeverity("success");
                  setSnackbarOpen(true);
                } else {
                  setSnackbarMessage(
                    t("socialSupportFormWizard.validationError")
                  );
                  setSnackbarSeverity("error");
                  setSnackbarOpen(true);
                }
              }}
            >
              {t("personalInfoForm.save")}
            </Button>
          )}
          {activeStep === 1 && (
            <Button
              variant="contained"
              color="secondary"
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 1 },
              }}
              aria-label={t("familyFinancialInfoForm.save")}
              onClick={async () => {
                const isValid =
                  await familyFinancialInfoFormRef.current?.submitForm();
                if (isValid) {
                  setSnackbarMessage(
                    t("familyFinancialInfoForm.save") +
                      " " +
                      t("socialSupportFormWizard.savedSuccessfully")
                  );
                  setSnackbarSeverity("success");
                  setSnackbarOpen(true);
                } else {
                  setSnackbarMessage(
                    t("socialSupportFormWizard.validationError")
                  );
                  setSnackbarSeverity("error");
                  setSnackbarOpen(true);
                }
              }}
            >
              {t("familyFinancialInfoForm.save")}
            </Button>
          )}
          {activeStep === 2 && (
            <Button
              variant="contained"
              color="secondary"
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 1 },
              }}
              aria-label={t("situationDescriptionsForm.save")}
              onClick={async () => {
                const isValid =
                  await situationDescriptionsFormRef.current?.submitForm();
                if (isValid) {
                  setSnackbarMessage(
                    t("situationDescriptionsForm.save") +
                      " " +
                      t("socialSupportFormWizard.savedSuccessfully")
                  );
                  setSnackbarSeverity("success");
                  setSnackbarOpen(true);
                } else {
                  setSnackbarMessage(
                    t("socialSupportFormWizard.validationError")
                  );
                  setSnackbarSeverity("error");
                  setSnackbarOpen(true);
                }
              }}
            >
              {t("situationDescriptionsForm.save")}
            </Button>
          )}

          {/* Submit button for step 2 */}
          {activeStep === 2 && (
            <Button
              type="button"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 1 },
              }}
              onClick={async () => {
                setSubmitError(null); // Clear any previous error before attempting to submit again
                handleSubmitAllForms();
              }}
              aria-label={t("situationDescriptionsForm.submitApplication")}
            >
              {t("situationDescriptionsForm.submitApplication")}
            </Button>
          )}
        </Box>
      </Box>

      {/* Snackbar for showing messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SocialSupportFormWizardWithProvider;
