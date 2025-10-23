import React, { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
import type { FormRef } from "../../types/formTypes";
import {
  getPersonalInfoSchema,
  type PersonalInfoFormData,
} from "../../utils/validation.util";

type FormData = PersonalInfoFormData;

interface PersonalInfoFormProps {
  defaultValues?: Partial<FormData>;
}

const PersonalInfoForm = forwardRef<FormRef, PersonalInfoFormProps>(
  ({ defaultValues }, ref) => {
    const { t } = useTranslation();
    const { updatePersonalInfo } = useSocialSupportWizard();

    const schema = getPersonalInfoSchema(t);
    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
      reset,
      setValue,
      watch,
    } = useForm<FormData>({
      resolver: yupResolver(schema),
      defaultValues: defaultValues || {},
    });

    const watchedGender = watch("gender");

    React.useEffect(() => {
      if (defaultValues) {
        reset(defaultValues);
      }
    }, [defaultValues, reset]);

    React.useEffect(() => {
      if (defaultValues?.gender) {
        setValue("gender", defaultValues.gender);
      }
    }, [defaultValues?.gender, setValue]);

    const handleFormSubmit = (data: FormData) => {
      console.log("Form Data:", data);
      updatePersonalInfo(data);
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
                <TextField
                  fullWidth
                  label={t("personalInfoForm.name")}
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  variant="outlined"
                  slotProps={{
                    inputLabel: {
                      htmlFor: "name-input",
                      shrink: true,
                    },
                    htmlInput: {
                      "aria-describedby": errors.name ? "name-error" : undefined,
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
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <TextField
                  fullWidth
                  label={t("personalInfoForm.nationalId")}
                  {...register("nationalId")}
                  error={!!errors.nationalId}
                  helperText={errors.nationalId?.message}
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
                          max: new Date().toISOString().split("T")[0],
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
                          : value || ""
                      }
                      error={!!errors.dateOfBirth}
                      helperText={errors.dateOfBirth?.message}
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
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={!!errors.gender}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
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
                    {...register("gender")}
                    label={t("personalInfoForm.gender")}
                    value={watchedGender || defaultValues?.gender || ""}
                    slotProps={{
                      input: {
                        id: "gender-select",
                        "aria-describedby": errors.gender
                          ? "gender-error"
                          : undefined,
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
                  {errors.gender.message}
                </Typography>
              )}

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <TextField
                  fullWidth
                  label={t("personalInfoForm.address")}
                  {...register("address")}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  variant="outlined"
                  slotProps={{
                    inputLabel: {
                      htmlFor: "address-input",
                      shrink: true,
                    },
                    htmlInput: {
                      "aria-describedby": errors.address
                        ? "address-error"
                        : undefined,
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
                  <TextField
                    fullWidth
                    label={t("personalInfoForm.city")}
                    {...register("city")}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                    variant="outlined"
                    slotProps={{
                      inputLabel: {
                        htmlFor: "city-input",
                        shrink: true,
                      },
                      htmlInput: {
                        "aria-describedby": errors.city
                          ? "city-error"
                          : undefined,
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
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <TextField
                    fullWidth
                    label={t("personalInfoForm.state")}
                    {...register("state")}
                    error={!!errors.state}
                    helperText={errors.state?.message}
                    variant="outlined"
                    slotProps={{
                      inputLabel: {
                        htmlFor: "state-input",
                        shrink: true,
                      },
                      htmlInput: {
                        "aria-describedby": errors.state
                          ? "state-error"
                          : undefined,
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
                  <TextField
                    fullWidth
                    label={t("personalInfoForm.country")}
                    {...register("country")}
                    error={!!errors.country}
                    helperText={errors.country?.message}
                    variant="outlined"
                    slotProps={{
                      inputLabel: {
                        htmlFor: "country-input",
                        shrink: true,
                      },
                      htmlInput: {
                        "aria-describedby": errors.country
                          ? "country-error"
                          : undefined,
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
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <TextField
                    fullWidth
                    label={t("personalInfoForm.phone")}
                    {...register("phone")}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    variant="outlined"
                    slotProps={{
                      inputLabel: {
                        htmlFor: "phone-input",
                        shrink: true,
                      },
                      htmlInput: {
                        "aria-describedby": errors.phone
                          ? "phone-error"
                          : undefined,
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
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <TextField
                  fullWidth
                  label={t("personalInfoForm.email")}
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  variant="outlined"
                  slotProps={{
                    inputLabel: {
                      htmlFor: "email-input",
                      shrink: true,
                    },
                    htmlInput: {
                      "aria-describedby": errors.email
                        ? "email-error"
                        : undefined,
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
              </Box>
            </Box>
          </form>
        </Box>
      </Container>
    );
  }
);

export default PersonalInfoForm;
