import React, { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormSubmission } from "../../hooks/useFormSubmission";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useSocialSupportWizard } from "../../context/useSocialSupportWizard";
import type { FormRef, FamilyFinancialInfoFormData } from "../../types/formTypes";
import {
  getFamilyFinancialInfoSchema,
} from "../../utils/validation.util";
import type { FamilyFinancialInfoFormProps } from "../../types/componentTypes";

type FormData = FamilyFinancialInfoFormData;

const FamilyFinancialInfoForm = forwardRef<
  FormRef,
  FamilyFinancialInfoFormProps
>(({ defaultValues }, ref) => {
  const { t } = useTranslation();
  const { updateFamilyFinancialInfo } = useSocialSupportWizard();

  const schema = getFamilyFinancialInfoSchema(t);
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues || {},
  });

  React.useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = (data: FormData) => {
    console.log("Family & Financial Info Data:", data);
    updateFamilyFinancialInfo(data);
  };

  const { submitForm, saveForm } = useFormSubmission(
    handleSubmit,
    handleFormSubmit
  );

  useImperativeHandle(ref, () => ({
    submitForm,
    saveForm,
  }));
  return (
    <Container
      maxWidth="md"
      className="FamilyFinancialInfoForm"
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
          {t("familyFinancialInfoForm.title")}
        </Typography>
        <form noValidate autoComplete="off">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 1.5, sm: 2, md: 2 },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Controller
                name="maritalStatus"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={!!errors.maritalStatus}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        textAlign: "left",
                      },
                      "& .MuiSelect-select": {
                        textAlign: "left",
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      },
                      "& .MuiFormHelperText-root": {
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      },
                    }}
                    id="marital-status-form-control"
                  >
                    <InputLabel htmlFor="marital-status-select">
                      {t("familyFinancialInfoForm.maritalStatus")}
                    </InputLabel>
                    <Select
                      {...field}
                      label={t("familyFinancialInfoForm.maritalStatus")}
                      value={field.value || defaultValues?.maritalStatus || ""}
                      slotProps={{
                        input: {
                          id: "marital-status-select",
                          "aria-describedby": errors.maritalStatus
                            ? "marital-status-error"
                            : undefined,
                        },
                      }}
                    >
                      <MenuItem value="single">
                        {t("familyFinancialInfoForm.maritalStatusOptions.single")}
                      </MenuItem>
                      <MenuItem value="married">
                        {t("familyFinancialInfoForm.maritalStatusOptions.married")}
                      </MenuItem>
                      <MenuItem value="divorced">
                        {t("familyFinancialInfoForm.maritalStatusOptions.divorced")}
                      </MenuItem>
                      <MenuItem value="widowed">
                        {t("familyFinancialInfoForm.maritalStatusOptions.widowed")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
            {errors.maritalStatus && (
              <Typography
                id="marital-status-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: "14px", sm: "24px" }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.maritalStatus.message}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Controller
                name="dependents"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label={t("familyFinancialInfoForm.dependents")}
                    type="number"
                    {...field}
                    error={!!errors.dependents}
                    helperText={errors.dependents?.message}
                    variant="outlined"
                    slotProps={{
                      inputLabel: {
                        htmlFor: "dependents-input",
                        shrink: true,
                      },
                      htmlInput: {
                        min: 0,
                        "aria-describedby": errors.dependents
                          ? "dependents-error"
                          : undefined,
                      },
                    }}
                    id="dependents-input"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.startsWith('0') && value.length > 1) {
                        const correctedValue = value.replace(/^0+/, '');
                        if (correctedValue) {
                          field.onChange(parseInt(correctedValue, 10));
                        } else {
                          field.onChange(0);
                        }
                      } else {
                        field.onChange(value ? parseInt(value, 10) : 0);
                      }
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Controller
                name="employmentStatus"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={!!errors.employmentStatus}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        textAlign: "left",
                      },
                      "& .MuiSelect-select": {
                        textAlign: "left",
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      },
                      "& .MuiFormHelperText-root": {
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      },
                    }}
                    id="employment-status-form-control"
                  >
                    <InputLabel htmlFor="employment-status-select">
                      {t("familyFinancialInfoForm.employmentStatus")}
                    </InputLabel>
                    <Select
                      {...field}
                      label={t("familyFinancialInfoForm.employmentStatus")}
                      value={field.value || defaultValues?.employmentStatus || ""}
                      slotProps={{
                        input: {
                          id: "employment-status-select",
                          "aria-describedby": errors.employmentStatus
                            ? "employment-status-error"
                            : undefined,
                        },
                      }}
                    >
                      <MenuItem value="employed">
                        {t(
                          "familyFinancialInfoForm.employmentStatusOptions.employed"
                        )}
                      </MenuItem>
                      <MenuItem value="unemployed">
                        {t(
                          "familyFinancialInfoForm.employmentStatusOptions.unemployed"
                        )}
                      </MenuItem>
                      <MenuItem value="self-employed">
                        {t(
                          "familyFinancialInfoForm.employmentStatusOptions.selfEmployed"
                        )}
                      </MenuItem>
                      <MenuItem value="retired">
                        {t(
                          "familyFinancialInfoForm.employmentStatusOptions.retired"
                        )}
                      </MenuItem>
                      <MenuItem value="student">
                        {t(
                          "familyFinancialInfoForm.employmentStatusOptions.student"
                        )}
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
            {errors.employmentStatus && (
              <Typography
                id="employment-status-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: "14px", sm: "24px" }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.employmentStatus.message}
              </Typography>
            )}

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: "center" }}>
              <Controller
                name="monthlyIncome"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label={t("familyFinancialInfoForm.monthlyIncome")}
                    {...field}
                    error={!!errors.monthlyIncome}
                    helperText={errors.monthlyIncome?.message}
                    variant="outlined"
                    slotProps={{
                      inputLabel: {
                        htmlFor: "monthly-income-input",
                        shrink: true,
                      },
                      htmlInput: {
                        min: 0,
                        "aria-describedby": errors.monthlyIncome
                          ? "monthly-income-error"
                          : undefined,
                      },
                    }}
                    id="monthly-income-input"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.startsWith('0') && value.length > 1) {
                        const correctedValue = value.replace(/^0+/, '');
                        if (correctedValue) {
                          field.onChange(parseInt(correctedValue, 10));
                        } else {
                          field.onChange(0);
                        }
                      } else {
                        field.onChange(value ? parseInt(value, 10) : 0);
                      }
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      },
                      minWidth: { sm: "150px" },
                    }}
                  />
                )}
              />
              
              <Controller
                name="monthlyIncomeCurrency"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={!!errors.monthlyIncomeCurrency}
                    sx={{
                      minWidth: { sm: "200px" },
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        textAlign: "left",
                      },
                      "& .MuiSelect-select": {
                        textAlign: "left",
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      },
                      "& .MuiFormHelperText-root": {
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      },
                    }}
                    id="monthly-income-currency-form-control"
                  >
                    <InputLabel htmlFor="monthly-income-currency-select">
                      {t("familyFinancialInfoForm.monthlyIncomeCurrency")}
                    </InputLabel>
                    <Select
                      {...field}
                      label={t("familyFinancialInfoForm.monthlyIncomeCurrency")}
                      value={field.value || defaultValues?.monthlyIncomeCurrency || "USD"}
                      slotProps={{
                        input: {
                          id: "monthly-income-currency-select",
                          "aria-describedby": errors.monthlyIncomeCurrency
                            ? "monthly-income-currency-error"
                            : undefined,
                        },
                      }}
                    >
                      <MenuItem value="USD">
                        {t("familyFinancialInfoForm.currencyOptions.USD")}
                      </MenuItem>
                      <MenuItem value="AED">
                        {t("familyFinancialInfoForm.currencyOptions.AED")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
            {errors.monthlyIncome && (
              <Typography
                id="monthly-income-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: "14px", sm: "24px" }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.monthlyIncome.message}
              </Typography>
            )}
            {errors.monthlyIncomeCurrency && (
              <Typography
                id="monthly-income-currency-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: "14px", sm: "24px" }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.monthlyIncomeCurrency.message}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Controller
                name="housingStatus"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={!!errors.housingStatus}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        textAlign: "left",
                      },
                      "& .MuiSelect-select": {
                        textAlign: "left",
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      },
                      "& .MuiFormHelperText-root": {
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      },
                    }}
                    id="housing-status-form-control"
                  >
                    <InputLabel htmlFor="housing-status-select">
                      {t("familyFinancialInfoForm.housingStatus")}
                    </InputLabel>
                    <Select
                      {...field}
                      label={t("familyFinancialInfoForm.housingStatus")}
                      value={field.value || defaultValues?.housingStatus || ""}
                      slotProps={{
                        input: {
                          id: "housing-status-select",
                          "aria-describedby": errors.housingStatus
                            ? "housing-status-error"
                            : undefined,
                        },
                      }}
                    >
                      <MenuItem value="own">
                        {t("familyFinancialInfoForm.housingStatusOptions.own")}
                      </MenuItem>
                      <MenuItem value="rent">
                        {t("familyFinancialInfoForm.housingStatusOptions.rent")}
                      </MenuItem>
                      <MenuItem value="with-family-friends">
                        {t(
                          "familyFinancialInfoForm.housingStatusOptions.withFamilyFriends"
                        )}
                      </MenuItem>
                      <MenuItem value="temporary">
                        {t(
                          "familyFinancialInfoForm.housingStatusOptions.temporary"
                        )}
                      </MenuItem>
                      <MenuItem value="homeless">
                        {t("familyFinancialInfoForm.housingStatusOptions.homeless")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
            {errors.housingStatus && (
              <Typography
                id="housing-status-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: "14px", sm: "24px" }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.housingStatus.message}
              </Typography>
            )}
          </Box>
        </form>
      </Box>
    </Container>
  );
});

export default FamilyFinancialInfoForm;
