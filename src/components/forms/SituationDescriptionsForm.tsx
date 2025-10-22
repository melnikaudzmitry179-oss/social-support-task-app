import { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useSocialSupportWizard } from "../../context/useSocialSupportWizard";
import { useAiSuggestion } from "../../hooks/useAiSuggestion";
import AiSuggestionPopup from "../popups/AiSuggestionPopup";
import type { FormRef } from "../../types/formTypes";
import {
  getSituationDescriptionsSchema,
  type SituationDescriptionsFormData,
} from "../../utils/validation.util";

type FormData = SituationDescriptionsFormData;

interface SituationDescriptionsFormProps {
  defaultValues?: Partial<FormData>;
}

const SituationDescriptionsForm = forwardRef<
  FormRef,
  SituationDescriptionsFormProps
>(({ defaultValues }, ref) => {
  const { updateSituationDescriptions } = useSocialSupportWizard();
  const { t } = useTranslation();

  const schema = getSituationDescriptionsSchema(t);
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
    },
  });

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

  const handleFormSubmit = (data: FormData) => {
    console.log("Situation Descriptions Data:", data);
    updateSituationDescriptions(data);
  };

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      return new Promise((resolve) => {
        const handleValidSubmit = (data: FormData) => {
          handleFormSubmit(data);
          resolve(true);
        };

        const handleInvalidSubmit = () => {
          resolve(false);
        };

        handleSubmit(handleValidSubmit, handleInvalidSubmit)();
      });
    },
    saveForm: async () => {
      return new Promise((resolve) => {
        const handleValidSubmit = (data: FormData) => {
          handleFormSubmit(data);
          resolve(true);
        };

        const handleInvalidSubmit = () => {
          resolve(false);
        };

        handleSubmit(handleValidSubmit, handleInvalidSubmit)();
      });
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
          <form noValidate>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1.5, sm: 2, md: 2 },
              }}
            >
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
            </Box>
          </form>
        </Box>
      </Container>

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
