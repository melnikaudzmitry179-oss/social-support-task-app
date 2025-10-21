import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

// Define the validation schema using Yup
const schema = yup.object({
  name: yup.string().required('Name is required'),
  nationalId: yup.string().required('National ID is required'),
  dateOfBirth: yup.date().required('Date of Birth is required'),
  gender: yup.string().required('Gender is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  country: yup.string().required('Country is required'),
  phone: yup.string().required('Phone is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
}).required();

// Define the form data type
export type FormData = yup.InferType<typeof schema>;

interface PersonalInfoFormProps {
  onSubmit?: (data: FormData) => void;
 defaultValues?: Partial<FormData>;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onSubmit, defaultValues }) => {
  // Initialize the form with react-hook-form and yup validation
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
    if (onSubmit) {
      onSubmit(data);
    } else {
      alert('Form submitted successfully!');
      reset(); // Reset form after successful submission
    }
 };

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
          Personal Information Form
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2, md: 2 } }}>
            {/* Name Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label="Name"
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
                label="National ID"
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
                    label="Date of Birth"
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
                <InputLabel htmlFor="gender-select">Gender</InputLabel>
                <Select
                  {...register('gender')}
                  label="Gender"
                  value={watchedGender || defaultValues?.gender || ''}
                  inputProps={{
                    id: 'gender-select',
                    'aria-describedby': errors.gender ? 'gender-error' : undefined
                  }}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
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
                label="Address"
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
                  label="City"
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
                  label="State"
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
                width: { xs: '100%', sm: 'auto' }
              }}>
                <TextField
                  fullWidth
                  label="Country"
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
                  label="Phone"
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
                label="Email"
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

            {/* Submit Button */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', sm: 'flex-end' },
                mt: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 2 }
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.5, sm: 1 }
                }}
                aria-label="Submit personal information form"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default PersonalInfoForm;