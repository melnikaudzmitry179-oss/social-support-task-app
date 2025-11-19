import React, { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
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
import type { FormRef, PersonalInfoFormData } from "../../types/formTypes";
import {
  getPersonalInfoSchema,
} from "../../utils/validation.util";
import type { PersonalInfoFormProps } from "../../types/componentTypes";

const castToPersonalInfoFormData = (data: PersonalInfoFormData): PersonalInfoFormData => {
  return {
    ...data,
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
  };
};

const PersonalInfoForm = forwardRef<FormRef, PersonalInfoFormProps>(
  ({ defaultValues }, ref) => {
    const { t } = useTranslation();
    const { updatePersonalInfo } = useSocialSupportWizard();

    const schema = getPersonalInfoSchema(t);
    const {
      handleSubmit,
      control,
      formState: { errors },
      reset,
    } = useForm<PersonalInfoFormData>({
      resolver: yupResolver(schema) as import('react-hook-form').Resolver<PersonalInfoFormData>,
      defaultValues: {
        name: "",
        nationalId: "",
        dateOfBirth: undefined,
        gender: "",
        address: "",
        city: "",
        state: "",
        country: "",
        phone: "",
        email: "",
      },
    });

    React.useEffect(() => {
      if (defaultValues) {
        reset(defaultValues);
      }
    }, [defaultValues, reset]);

    const handleFormSubmit = (data: PersonalInfoFormData) => {
      console.log("Form Data:", data);
      updatePersonalInfo(castToPersonalInfoFormData(data));
    };
  
    const { submitForm, saveForm } = useFormSubmission<PersonalInfoFormData>(
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
        className="PersonalInfoForm"
        sx={{
          px: { xs: 1, sm: 2, md: 0 },
          mt: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
              mb: { xs: 2, md: 3 },
            }}
          >
            {t("personalInfoForm.title")}
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
                  name="name"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      label={t("personalInfoForm.name")}
                      {...field}
                      error={!!error}
                      helperText={(error?.message as React.ReactNode) || ''}
                      variant="outlined"
                      slotProps={{
                        inputLabel: {
                          htmlFor: "name-input",
                          shrink: true,
                        },
                        htmlInput: {
                          "aria-describedby": error ? "name-error" : undefined,
                        },
                      }}
                      id="name-input"
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
                  name="nationalId"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <TextField
                      fullWidth
                      label={t("personalInfoForm.nationalId")}
                      value={value || ""}
                      onChange={(e) => {
                        const formattedValue = e.target.value.replace(/\D/g, '').slice(0, 12);
                        onChange(formattedValue);
                      }}
                      error={!!errors.nationalId}
                      helperText={(errors.nationalId?.message as React.ReactNode) || ''}
                      variant="outlined"
                      slotProps={{
                        inputLabel: {
                          htmlFor: "national-id-input",
                          shrink: true,
                        },
                        htmlInput: {
                          "aria-describedby": errors.nationalId
                            ? "national-id-error"
                            : undefined,
                          maxLength: 12,
                        },
                      }}
                      id="national-id-input"
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                        },
                      }}
                      {...field}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <TextField
                      fullWidth
                      label={t("personalInfoForm.dateOfBirth")}
                      type="date"
                      slotProps={{
                        inputLabel: {
                          htmlFor: "date-of-birth-input",
                          shrink: true,
                        },
                        htmlInput: {
                          max: (() => {
                            const today = new Date();
                            const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                            return eighteenYearsAgo.toISOString().split("T")[0];
                          })(),
                          "aria-describedby": errors.dateOfBirth
                            ? "date-of-birth-error"
                            : undefined,
                        },
                      }}
                      id="date-of-birth-input"
                      onChange={(e) => {
                        const dateValue = e.target.value
                          ? new Date(e.target.value)
                          : null;
                        onChange(dateValue);
                      }}
                      value={
                        value instanceof Date
                          ? value.toISOString().split("T")[0]
                          : ""
                      }
                      error={!!errors.dateOfBirth}
                      helperText={(errors.dateOfBirth?.message as React.ReactNode) || ''}
                      variant="outlined"
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                        },
                      }}
                      {...field}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl
                      fullWidth
                      variant="outlined"
                      error={!!error}
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
                      id="gender-form-control"
                    >
                      <InputLabel htmlFor="gender-select">
                        {t("personalInfoForm.gender")}
                      </InputLabel>
                      <Select
                        {...field}
                        label={t("personalInfoForm.gender")}
                        value={field.value || defaultValues?.gender || ""}
                        slotProps={{
                          input: {
                            id: "gender-select",
                            "aria-describedby": error ? "gender-error" : undefined,
                          },
                        }}
                      >
                        <MenuItem value="male">
                          {t("personalInfoForm.genderOptions.male")}
                        </MenuItem>
                        <MenuItem value="female">
                          {t("personalInfoForm.genderOptions.female")}
                        </MenuItem>
                        <MenuItem value="other">
                          {t("personalInfoForm.genderOptions.other")}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>
              {errors.gender && (
                <Typography
                  id="gender-error"
                  variant="caption"
                  color="error"
                  sx={{ pl: { xs: "14px", sm: "24px" }, mt: -0.5 }}
                  role="alert"
                  aria-live="polite"
                >
                  {(errors.gender?.message as React.ReactNode) || ''}
                </Typography>
              )}

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      label={t("personalInfoForm.address")}
                      {...field}
                      error={!!error}
                      helperText={(error?.message as React.ReactNode) || ''}
                      variant="outlined"
                      slotProps={{
                        inputLabel: {
                          htmlFor: "address-input",
                          shrink: true,
                        },
                        htmlInput: {
                          "aria-describedby": error ? "address-error" : undefined,
                        },
                      }}
                      id="address-input"
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

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1.5, sm: 2 },
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <Controller
                    name="city"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        fullWidth
                        label={t("personalInfoForm.city")}
                        {...field}
                        error={!!error}
                        helperText={(error?.message as React.ReactNode) || ''}
                        variant="outlined"
                        slotProps={{
                          inputLabel: {
                            htmlFor: "city-input",
                            shrink: true,
                          },
                          htmlInput: {
                            "aria-describedby": error ? "city-error" : undefined,
                          },
                        }}
                        id="city-input"
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
                <Box
                  sx={{
                    flex: 1,
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <Controller
                    name="state"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        fullWidth
                        label={t("personalInfoForm.state")}
                        {...field}
                        error={!!error}
                        helperText={(error?.message as React.ReactNode) || ''}
                        variant="outlined"
                        slotProps={{
                          inputLabel: {
                            htmlFor: "state-input",
                            shrink: true,
                          },
                          htmlInput: {
                            "aria-describedby": error ? "state-error" : undefined,
                          },
                        }}
                        id="state-input"
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
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1.5, sm: 2 },
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    width: { xs: "auto", sm: "auto" },
                  }}
                >
                  <Controller
                    name="country"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        fullWidth
                        label={t("personalInfoForm.country")}
                        {...field}
                        error={!!error}
                        helperText={(error?.message as React.ReactNode) || ''}
                        variant="outlined"
                        slotProps={{
                          inputLabel: {
                            htmlFor: "country-input",
                            shrink: true,
                          },
                          htmlInput: {
                            "aria-describedby": error ? "country-error" : undefined,
                          },
                        }}
                        id="country-input"
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
                <Box
                  sx={{
                    flex: 1,
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        fullWidth
                        label={t("personalInfoForm.phone")}
                        {...field}
                        error={!!error}
                        helperText={(error?.message as React.ReactNode) || ''}
                        variant="outlined"
                        slotProps={{
                          inputLabel: {
                            htmlFor: "phone-input",
                            shrink: true,
                          },
                          htmlInput: {
                            "aria-describedby": error ? "phone-error" : undefined,
                          },
                        }}
                        id="phone-input"
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
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      label={t("personalInfoForm.email")}
                      {...field}
                      error={!!error}
                      helperText={(error?.message as React.ReactNode) || ''}
                      variant="outlined"
                      slotProps={{
                        inputLabel: {
                          htmlFor: "email-input",
                          shrink: true,
                        },
                        htmlInput: {
                          "aria-describedby": error ? "email-error" : undefined,
                        },
                      }}
                      id="email-input"
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
            </Box>
          </form>
        </Box>
      </Container>
    );
  }
);

export default PersonalInfoForm;
