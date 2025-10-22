import React, { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useSocialSupportWizard } from '../context/useSocialSupportWizard';
import type { FormRef } from '../types/formTypes';

// Define the validation schema using Yup with translated error messages
const getSchema = (t: (key: string) => string) => yup.object({
  name: yup
    .string()
    .required(t('validation.nameRequired'))
    .min(2, t('validation.nameMinLength') || 'Name must be at least 2 characters')
    .max(100, t('validation.nameMaxLength') || 'Name must not exceed 100 characters'),
  nationalId: yup
    .string()
    .required(t('validation.nationalIdRequired'))
    .min(5, t('validation.nationalIdMinLength') || 'National ID must be at least 5 characters')
    .max(20, t('validation.nationalIdMaxLength') || 'National ID must not exceed 20 characters'),
  dateOfBirth: yup
    .date()
    .required(t('validation.dateOfBirthRequired'))
    .max(new Date(), t('validation.dateOfBirthPast') || 'Date of birth must be in the past')
    .test(
      'not-too-old',
      t('validation.dateOfBirthNotTooOld') || 'Date of birth must be within reasonable range (not older than 120 years)',
      function(value) {
        if (!value) return true;
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        return age <= 120;
      }
    ),
  gender: yup.string().required(t('validation.genderRequired')),
  address: yup
    .string()
    .required(t('validation.addressRequired'))
    .min(5, t('validation.addressMinLength') || 'Address must be at least 5 characters')
    .max(200, t('validation.addressMaxLength') || 'Address must not exceed 200 characters'),
  city: yup
    .string()
    .required(t('validation.cityRequired'))
    .min(2, t('validation.cityMinLength') || 'City must be at least 2 characters')
    .max(50, t('validation.cityMaxLength') || 'City must not exceed 50 characters'),
  state: yup
    .string()
    .required(t('validation.stateRequired'))
    .min(2, t('validation.stateMinLength') || 'State must be at least 2 characters')
    .max(50, t('validation.stateMaxLength') || 'State must not exceed 50 characters'),
  country: yup
    .string()
    .required(t('validation.countryRequired'))
    .min(2, t('validation.countryMinLength') || 'Country must be at least 2 characters')
    .max(50, t('validation.countryMaxLength') || 'Country must not exceed 50 characters'),
  phone: yup
    .string()
    .required(t('validation.phoneRequired'))
    .matches(
      /^\+?[1-9]\d{0,15}$/,
      t('validation.phoneInvalid') || 'Invalid phone number format'
    ),
  email: yup
    .string()
    .email(t('validation.emailInvalid'))
    .required(t('validation.emailRequired'))
    .max(100, t('validation.emailMaxLength') || 'Email must not exceed 100 characters'),
}).required();

// Define the form data type
export type FormData = yup.InferType<ReturnType<typeof getSchema>>;

interface PersonalInfoFormProps {
  defaultValues?: Partial<FormData>;
}

const PersonalInfoForm = forwardRef<FormRef, PersonalInfoFormProps>(({ defaultValues }, ref) => {
  const { t } = useTranslation();
  const { updatePersonalInfo } = useSocialSupportWizard();
  
  // Initialize the form with react-hook-form and yup validation
  const schema = getSchema(t);
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

  // Watch the gender field to trigger re-render when it changes
  const watchedGender = watch('gender');

  // Reset form when defaultValues change to ensure selects are properly populated
  React.useEffect(() => {
    if (defaultValues) {
      // Reset the entire form with new default values
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  // Ensure the select values are properly set when defaultValues change
  React.useEffect(() => {
    if (defaultValues?.gender) {
      setValue('gender', defaultValues.gender);
    }
  }, [defaultValues?.gender, setValue]);

  // Handle form submission
  const handleFormSubmit = (data: FormData) => {
    console.log('Form Data:', data);
    // Update the context with form data
    updatePersonalInfo(data);
  };

  // Expose the submitForm function via ref
  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      return new Promise((resolve) => {
        const handleValidSubmit = (data: FormData) => {
          handleFormSubmit(data);
          resolve(true); // Validation passed and form was submitted
        };
        
        const handleInvalidSubmit = () => {
          // This is called when validation fails
          resolve(false); // Validation failed
        };
        
        handleSubmit(handleValidSubmit, handleInvalidSubmit)();
      });
    }
  }));

  return (
    <Container maxWidth="md" sx={{
      px: { xs: 1, sm: 2, md: 0 },
      mt: { xs: 2, sm: 3, md: 4 },
      mb: { xs: 2, sm: 3, md: 4 }
    }}>
      <Box>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
            mb: { xs: 2, md: 3 }
          }}
        >
          {t('personalInfoForm.title')}
        </Typography>
        <form noValidate autoComplete="off">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2, md: 2 } }}>
            {/* Name Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label={t('personalInfoForm.name')}
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                variant="outlined"
                InputLabelProps={{
                  htmlFor: "name-input",
                  shrink: true,
                }}
                id="name-input"
                inputProps={{
                  'aria-describedby': errors.name ? 'name-error' : undefined
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Box>
            {errors.name && (
              <Typography
                id="name-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.name.message}
              </Typography>
            )}

            {/* National ID Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label={t('personalInfoForm.nationalId')}
                {...register('nationalId')}
                error={!!errors.nationalId}
                helperText={errors.nationalId?.message}
                variant="outlined"
                InputLabelProps={{
                  htmlFor: "national-id-input",
                  shrink: true,
                }}
                id="national-id-input"
                inputProps={{
                  'aria-describedby': errors.nationalId ? 'national-id-error' : undefined
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Box>
            {errors.nationalId && (
              <Typography
                id="national-id-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.nationalId.message}
              </Typography>
            )}

            {/* Date of Birth Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    fullWidth
                    label={t('personalInfoForm.dateOfBirth')}
                    type="date"
                    InputLabelProps={{
                      htmlFor: "date-of-birth-input",
                      shrink: true,
                    }}
                    id="date-of-birth-input"
                    inputProps={{
                      max: new Date().toISOString().split('T')[0], // Prevent future dates
                      'aria-describedby': errors.dateOfBirth ? 'date-of-birth-error' : undefined
                    }}
                    onChange={(e) => {
                      // Convert the date string from input to Date object for form state
                      const dateValue = e.target.value ? new Date(e.target.value) : null;
                      onChange(dateValue);
                    }}
                    value={value instanceof Date ? value.toISOString().split('T')[0] : value || ''}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                    variant="outlined"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }
                    }}
                    {...field}
                  />
                )}
              />
            </Box>
            {errors.dateOfBirth && (
              <Typography
                id="date-of-birth-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.dateOfBirth.message}
              </Typography>
            )}

            {/* Gender Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.gender}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }
                }}
                id="gender-form-control"
              >
                <InputLabel htmlFor="gender-select">{t('personalInfoForm.gender')}</InputLabel>
                <Select
                  {...register('gender')}
                  label={t('personalInfoForm.gender')}
                  value={watchedGender || defaultValues?.gender || ''}
                  inputProps={{
                    id: 'gender-select',
                    'aria-describedby': errors.gender ? 'gender-error' : undefined
                  }}
                >
                  <MenuItem value="male">{t('personalInfoForm.genderOptions.male')}</MenuItem>
                  <MenuItem value="female">{t('personalInfoForm.genderOptions.female')}</MenuItem>
                  <MenuItem value="other">{t('personalInfoForm.genderOptions.other')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {errors.gender && (
              <Typography
                id="gender-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.gender.message}
              </Typography>
            )}

            {/* Address Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label={t('personalInfoForm.address')}
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message}
                variant="outlined"
                InputLabelProps={{
                  htmlFor: "address-input",
                  shrink: true,
                }}
                id="address-input"
                inputProps={{
                  'aria-describedby': errors.address ? 'address-error' : undefined
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Box>
            {errors.address && (
              <Typography
                id="address-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.address.message}
              </Typography>
            )}

            {/* City and State Fields (in a row) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1.5, sm: 2 },
                justifyContent: 'center'
              }}
            >
              <Box sx={{
                flex: 1,
                width: { xs: '100%', sm: 'auto' }
              }}>
                <TextField
                  fullWidth
                  label={t('personalInfoForm.city')}
                  {...register('city')}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                  variant="outlined"
                  InputLabelProps={{
                    htmlFor: "city-input",
                    shrink: true,
                  }}
                  id="city-input"
                  inputProps={{
                    'aria-describedby': errors.city ? 'city-error' : undefined
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                />
              </Box>
              {errors.city && (
                <Typography
                  id="city-error"
                  variant="caption"
                  color="error"
                  sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                  role="alert"
                  aria-live="polite"
                >
                  {errors.city.message}
                </Typography>
              )}
              <Box sx={{
                flex: 1,
                width: { xs: '100%', sm: 'auto' }
              }}>
                <TextField
                  fullWidth
                  label={t('personalInfoForm.state')}
                  {...register('state')}
                  error={!!errors.state}
                  helperText={errors.state?.message}
                  variant="outlined"
                  InputLabelProps={{
                    htmlFor: "state-input",
                    shrink: true,
                  }}
                  id="state-input"
                  inputProps={{
                    'aria-describedby': errors.state ? 'state-error' : undefined
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                />
              </Box>
              {errors.state && (
                <Typography
                  id="state-error"
                  variant="caption"
                  color="error"
                  sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                  role="alert"
                  aria-live="polite"
                >
                  {errors.state.message}
                </Typography>
              )}
            </Box>

            {/* Country and Phone Fields (in a row) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1.5, sm: 2 },
                justifyContent: 'center'
              }}
            >
              <Box sx={{
                flex: 1,
                width: { xs: '10%', sm: 'auto' }
              }}>
                <TextField
                  fullWidth
                  label={t('personalInfoForm.country')}
                  {...register('country')}
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  variant="outlined"
                  InputLabelProps={{
                    htmlFor: "country-input",
                    shrink: true,
                  }}
                  id="country-input"
                  inputProps={{
                    'aria-describedby': errors.country ? 'country-error' : undefined
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                />
              </Box>
              {errors.country && (
                <Typography
                  id="country-error"
                  variant="caption"
                  color="error"
                  sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                  role="alert"
                  aria-live="polite"
                >
                  {errors.country.message}
                </Typography>
              )}
              <Box sx={{
                flex: 1,
                width: { xs: '100%', sm: 'auto' }
              }}>
                <TextField
                  fullWidth
                  label={t('personalInfoForm.phone')}
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  variant="outlined"
                  InputLabelProps={{
                    htmlFor: "phone-input",
                    shrink: true,
                  }}
                  id="phone-input"
                  inputProps={{
                    'aria-describedby': errors.phone ? 'phone-error' : undefined
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                />
              </Box>
              {errors.phone && (
                <Typography
                  id="phone-error"
                  variant="caption"
                  color="error"
                  sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                  role="alert"
                  aria-live="polite"
                >
                  {errors.phone.message}
                </Typography>
              )}
            </Box>

            {/* Email Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label={t('personalInfoForm.email')}
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                variant="outlined"
                InputLabelProps={{
                  htmlFor: "email-input",
                  shrink: true,
                }}
                id="email-input"
                inputProps={{
                  'aria-describedby': errors.email ? 'email-error' : undefined
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Box>
            {errors.email && (
              <Typography
                id="email-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.email.message}
              </Typography>
            )}

          </Box>
        </form>
      </Box>
    </Container>
  );
});

export default PersonalInfoForm;