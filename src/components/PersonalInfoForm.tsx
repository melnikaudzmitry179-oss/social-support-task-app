import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
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
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Personal Information Form
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Name Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label="Name"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                variant="outlined"
              />
            </Box>

            {/* National ID Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label="National ID"
                {...register('nationalId')}
                error={!!errors.nationalId}
                helperText={errors.nationalId?.message}
                variant="outlined"
              />
            </Box>

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
                      shrink: true,
                    }}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0] // Prevent future dates
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
                    {...field}
                  />
                )}
              />
            </Box>

            {/* Gender Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <FormControl fullWidth variant="outlined" error={!!errors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select
                  {...register('gender')}
                  label="Gender"
                  value={watchedGender || defaultValues?.gender || ''}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {errors.gender && (
                  <FormHelperText>{errors.gender.message}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Address Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label="Address"
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message}
                variant="outlined"
              />
            </Box>

            {/* City and State Fields (in a row) */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="City"
                  {...register('city')}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="State"
                  {...register('state')}
                  error={!!errors.state}
                  helperText={errors.state?.message}
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Country and Phone Fields (in a row) */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Country"
                  {...register('country')}
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  variant="outlined"
                />
              </Box>
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
              />
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" size="large">
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