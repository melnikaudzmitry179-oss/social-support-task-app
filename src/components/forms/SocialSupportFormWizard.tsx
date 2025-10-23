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
import { SocialSupportWizardProvider } from "../../context/SocialSupportWizardContext";
import { useSocialSupportWizard } from "../../context/useSocialSupportWizard";
import PersonalInfoForm from "./PersonalInfoForm";
import FamilyFinancialInfoForm from "./FamilyFinancialInfoForm";
import SituationDescriptionsForm from "./SituationDescriptionsForm";
import type { FormRef } from "../../types/formTypes";
import { getItem, setItem } from "../../utils/localStorage.util";
import {
  validatePersonalInfo,
  validateFamilyFinancialInfo,
} from "../../utils/validation.util";

interface LocalStorageFormData {
  personalInfo: {
    name: string;
    nationalId: string;
    dateOfBirth: string;
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

  const personalInfoFormRef = React.useRef<FormRef>(null);
  const familyFinancialInfoFormRef = React.useRef<FormRef>(null);
  const situationDescriptionsFormRef = React.useRef<FormRef>(null);

  const steps = [
    t("socialSupportFormWizard.stepLabels.0"),
    t("socialSupportFormWizard.stepLabels.1"),
    t("socialSupportFormWizard.stepLabels.2"),
  ];

  const [activeStep, setActiveStep] = React.useState(0);
  const [hasLoaded, setHasLoaded] = React.useState(false);

  const hasData = (data: Record<string, unknown> | null): boolean => {
    if (!data) return false;
    return Object.entries(data).some(([key, value]) => {
      if (key === 'dateOfBirth') {
        return value instanceof Date && value.getTime() !== new Date().getTime();
      }
      return value !== '' && value !== 0;
    });
  };

  useEffect(() => {
    const savedData = getItem<LocalStorageFormData>("formData");
    if (savedData) {
      if (savedData.personalInfo) {
        updatePersonalInfo({
          ...savedData.personalInfo,
          dateOfBirth: new Date(savedData.personalInfo.dateOfBirth),
        });
      }
      if (savedData.familyFinancialInfo) {
        updateFamilyFinancialInfo(savedData.familyFinancialInfo);
      }
      if (savedData.situationDescriptions) {
        updateSituationDescriptions(savedData.situationDescriptions);
      }

      if (hasData(savedData.situationDescriptions)) {
        setActiveStep(2);
      } else if (hasData(savedData.familyFinancialInfo)) {
        setActiveStep(1);
      } else if (hasData(savedData.personalInfo)) {
        setActiveStep(0);
      }
    }
    setLoading(false);
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      const localStorageData: LocalStorageFormData = {
        personalInfo: hasData(formData.personalInfo)
          ? {
              ...formData.personalInfo,
              dateOfBirth: formData.personalInfo.dateOfBirth.toString(),
            }
          : null,
        familyFinancialInfo: hasData(formData.familyFinancialInfo) ? formData.familyFinancialInfo : null,
        situationDescriptions: hasData(formData.situationDescriptions) ? formData.situationDescriptions : null,
      };
      setItem("formData", localStorageData);
    }
  }, [formData, hasLoaded]);

  const handleSubmitAllForms = async () => {
    try {
      const isSituationDescriptionsValid =
        await situationDescriptionsFormRef.current?.submitForm();

      const isPersonalInfoValid = await validatePersonalInfo(
        formData.personalInfo || {},
        t
      );
      const isFamilyFinancialInfoValid = await validateFamilyFinancialInfo(
        formData.familyFinancialInfo || {},
        t
      );

      if (
        !isPersonalInfoValid ||
        !isFamilyFinancialInfoValid ||
        !isSituationDescriptionsValid
      ) {
        setSubmitError(
          t("socialSupportFormWizard.validationError") ||
            "Please correct errors in the forms before submitting."
        );
        if (!isPersonalInfoValid) {
          setActiveStep(0);
        } else if (!isFamilyFinancialInfoValid) {
          setActiveStep(1);
        } else if (!isSituationDescriptionsValid) {
          setActiveStep(2);
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

    const fullFormData = {
      personalInfo: {
        ...formData.personalInfo,
        dateOfBirth: formData.personalInfo.dateOfBirth.toString(),
      },
      familyFinancialInfo: formData.familyFinancialInfo,
      situationDescriptions: formData.situationDescriptions,
    };
    console.log("Full Form Data:", fullFormData);

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

    setIsSubmitting(true);
    setSubmitError(null);

    setActiveStep(3);

    setIsSubmitting(false);
  };

  const handleBack = () => {
    setSubmitError(null);
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    resetFormData();
    setActiveStep(0);
    setSubmitError(null);

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
                    onClick={() => {
                      setSubmitError(null);
                      setActiveStep(2);
                    }}
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

        <Box
          sx={{
            mb: { xs: 2, sm: 3 },
            "& .MuiStepper-root": {
              "& .MuiStep-root": {
                "& .MuiStepLabel-root": {
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                },
                "& .MuiStepLabel-label": {
                  mt: 1,
                  textAlign: "center",
                },
              },
            },
          }}
          role="region"
          aria-label={t("socialSupportFormWizard.title")}
        >
          <Stepper
            activeStep={activeStep}
            orientation="horizontal"
            aria-label={t("socialSupportFormWizard.title")}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                      textAlign: "center",
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

        <Box id="form-content" tabIndex={-1}>
          {renderStepContent()}
        </Box>

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
              onClick={() => {
                setSubmitError(null);
                setActiveStep(1);
              }}
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
              onClick={() => {
                setSubmitError(null);
                setActiveStep(2);
              }}
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
                setSubmitError(null);
                handleSubmitAllForms();
              }}
              aria-label={t("situationDescriptionsForm.submitApplication")}
            >
              {t("situationDescriptionsForm.submitApplication")}
            </Button>
          )}
        </Box>
      </Box>

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
