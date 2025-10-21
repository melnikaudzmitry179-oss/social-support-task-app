import { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useSocialSupportWizard } from "../context/useSocialSupportWizard";
import { useAiSuggestion } from "../hooks/useAiSuggestion";
import AiSuggestionPopup from "./AiSuggestionPopup";

// Define the validation schema using Yup with translated error messages
const getSchema = (t: (key: string) => string) =>
  yup
    .object({
      currentFinancialSituation: yup
        .string()
        .required(t("validation.currentFinancialSituationRequired")),
      employmentCircumstances: yup
        .string()
        .required(t("validation.employmentCircumstancesRequired")),
      reasonForApplying: yup
        .string()
        .required(t("validation.reasonForApplyingRequired")),
    })
    .required();

// Define the form data type
export type FormData = yup.InferType<ReturnType<typeof getSchema>>;

// Define the ref type for form submission
export interface FormRef {
  submitForm: () => Promise<boolean>; // Returns true if validation passes
}

interface SituationDescriptionsFormProps {
  onSubmit: (data: FormData) => void;
  onBack?: () => void;
  defaultValues?: Partial<FormData>;
}

const SituationDescriptionsForm = forwardRef<
  FormRef,
  SituationDescriptionsFormProps
>(({ onSubmit,  defaultValues }, ref) => {
  const { updateSituationDescriptions } = useSocialSupportWizard();
  const { t } = useTranslation();

  // Initialize the form with react-hook-form and yup validation
  const schema = getSchema(t);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues || {},
  });

  // Use the AI suggestion hook
  const {
    editableSuggestion,
    isGenerating,
    currentField,
    showSuggestionPopup,
    aiError,
    setEditableSuggestion,
    handleGenerateSuggestion: handleGenerateSuggestionHook,
    handleAcceptSuggestion: handleAcceptSuggestionHook,
    handleDiscardSuggestion: handleDiscardSuggestionHook,
  } = useAiSuggestion({
    onAccept: (field, value) => {
      setValue(field, value);
    }
  });

  // Wrapper functions to maintain existing interface
  const handleGenerateSuggestion = async (fieldName: keyof FormData) => {
    const currentValue = getValues(fieldName) || "";
    await handleGenerateSuggestionHook(fieldName, currentValue);
  };

  const handleAcceptSuggestion = () => {
    handleAcceptSuggestionHook();
  };

  const handleDiscardSuggestion = () => {
    handleDiscardSuggestionHook();
  };

   // Handle form submission
   const handleFormSubmit = (data: FormData) => {
     console.log("Situation Descriptions Data:", data);
     onSubmit(data);
     // Don't reset the form here since it's handled by the wizard
   };

  // Handle save without submitting
  const handleSave = async () => {
    // Get current form values using getValues method
    const currentData = {
      currentFinancialSituation: getValues("currentFinancialSituation"),
      employmentCircumstances: getValues("employmentCircumstances"),
      reasonForApplying: getValues("reasonForApplying"),
    };
    updateSituationDescriptions(currentData);
  };

  // Expose the submitForm function via ref
  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      try {
        await handleSubmit(handleSave)();
        return true;
      } catch {
        return false;
      }
    },
  }));

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          px: { xs: 1, sm: 2, md: 0 },
          mt: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            align="center"
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
              mb: { xs: 2, md: 3 },
            }}
          >
            {t("situationDescriptionsForm.title")}
          </Typography>
          <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1.5, sm: 2, md: 2 },
              }}
            >
              {/* Current Financial Situation Field */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mr: 1 }}>
                    {t("situationDescriptionsForm.currentFinancialSituation")}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      handleGenerateSuggestion("currentFinancialSituation")
                    }
                    disabled={isGenerating}
                    sx={{
                      minWidth: "auto",
                      height: "30px",
                      fontSize: "0.75rem",
                      p: "2px 8px",
                    }}
                  >
                    {isGenerating &&
                    currentField === "currentFinancialSituation" ? (
                      <CircularProgress size={16} />
                    ) : (
                      t("situationDescriptionsForm.helpMeWrite")
                    )}
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  label={t(
                    "situationDescriptionsForm.currentFinancialSituation"
                  )}
                  multiline
                  rows={4}
                  {...register("currentFinancialSituation")}
                  error={!!errors.currentFinancialSituation}
                  helperText={errors.currentFinancialSituation?.message}
                  variant="outlined"
                  InputLabelProps={{
                    htmlFor: "current-financial-situation-input",
                    shrink: true,
                  }}
                  id="current-financial-situation-input"
                  inputProps={{
                    "aria-describedby": errors.currentFinancialSituation
                      ? "current-financial-situation-error"
                      : undefined,
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      py: { xs: 1, sm: 1.25 },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                />
              </Box>
              {errors.currentFinancialSituation && (
                <Typography
                  id="current-financial-situation-error"
                  variant="caption"
                  color="error"
                  sx={{ pl: { xs: "14px", sm: "24px" }, mt: -0.5 }}
                  role="alert"
                  aria-live="polite"
                >
                  {errors.currentFinancialSituation.message}
                </Typography>
              )}

              {/* Employment Circumstances Field */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mr: 1 }}>
                    {t("situationDescriptionsForm.employmentCircumstances")}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      handleGenerateSuggestion("employmentCircumstances")
                    }
                    disabled={isGenerating}
                    sx={{
                      minWidth: "auto",
                      height: "30px",
                      fontSize: "0.75rem",
                      p: "2px 8px",
                    }}
                  >
                    {isGenerating &&
                    currentField === "employmentCircumstances" ? (
                      <CircularProgress size={16} />
                    ) : (
                      t("situationDescriptionsForm.helpMeWrite")
                    )}
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  label={t("situationDescriptionsForm.employmentCircumstances")}
                  multiline
                  rows={4}
                  {...register("employmentCircumstances")}
                  error={!!errors.employmentCircumstances}
                  helperText={errors.employmentCircumstances?.message}
                  variant="outlined"
                  InputLabelProps={{
                    htmlFor: "employment-circumstances-input",
                    shrink: true,
                  }}
                  id="employment-circumstances-input"
                  inputProps={{
                    "aria-describedby": errors.employmentCircumstances
                      ? "employment-circumstances-error"
                      : undefined,
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      py: { xs: 1, sm: 1.25 },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                />
              </Box>
              {errors.employmentCircumstances && (
                <Typography
                  id="employment-circumstances-error"
                  variant="caption"
                  color="error"
                  sx={{ pl: { xs: "14px", sm: "24px" }, mt: -0.5 }}
                  role="alert"
                  aria-live="polite"
                >
                  {errors.employmentCircumstances.message}
                </Typography>
              )}

              {/* Reason for Applying Field */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mr: 1 }}>
                    {t("situationDescriptionsForm.reasonForApplying")}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      handleGenerateSuggestion("reasonForApplying")
                    }
                    disabled={isGenerating}
                    sx={{
                      minWidth: "auto",
                      height: "30px",
                      fontSize: "0.75rem",
                      p: "2px 8px",
                    }}
                  >
                    {isGenerating && currentField === "reasonForApplying" ? (
                      <CircularProgress size={16} />
                    ) : (
                      t("situationDescriptionsForm.helpMeWrite")
                    )}
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  label={t("situationDescriptionsForm.reasonForApplying")}
                  multiline
                  rows={4}
                  {...register("reasonForApplying")}
                  error={!!errors.reasonForApplying}
                  helperText={errors.reasonForApplying?.message}
                  variant="outlined"
                  InputLabelProps={{
                    htmlFor: "reason-for-applying-input",
                    shrink: true,
                  }}
                  id="reason-for-applying-input"
                  inputProps={{
                    "aria-describedby": errors.reasonForApplying
                      ? "reason-for-applying-error"
                      : undefined,
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      py: { xs: 1, sm: 1.25 },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                />
              </Box>
              {errors.reasonForApplying && (
                <Typography
                  id="reason-for-applying-error"
                  variant="caption"
                  color="error"
                  sx={{ pl: { xs: "14px", sm: "24px" }, mt: -0.5 }}
                  role="alert"
                  aria-live="polite"
                >
                  {errors.reasonForApplying.message}
                </Typography>
              )}
            </Box>
          </form>
        </Box>
      </Container>

      {/* AI Suggestion Popup */}
      <AiSuggestionPopup
        open={showSuggestionPopup}
        onClose={handleDiscardSuggestion}
        onAccept={handleAcceptSuggestion}
        editableSuggestion={editableSuggestion}
        setEditableSuggestion={setEditableSuggestion}
        isGenerating={isGenerating}
        aiError={aiError}
      />
    </>
  );
});

export default SituationDescriptionsForm;
