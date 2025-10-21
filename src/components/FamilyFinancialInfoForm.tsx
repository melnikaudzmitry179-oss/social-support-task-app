import React from 'react';
import { useForm } from 'react-hook-form';
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
  maritalStatus: yup.string().required('Marital Status is required'),
  dependents: yup.number().min(0, 'Dependents must be at least 0').required('Dependents is required'),
  employmentStatus: yup.string().required('Employment Status is required'),
  monthlyIncome: yup.number().min(0, 'Monthly Income must be at least 0').required('Monthly Income is required'),
  housingStatus: yup.string().required('Housing Status is required'),
}).required();

// Define the form data type
export type FormData = yup.InferType<typeof schema>;

interface FamilyFinancialInfoFormProps {
  onSubmit: (data: FormData) => void;
  defaultValues?: Partial<FormData>;
}

const FamilyFinancialInfoForm: React.FC<FamilyFinancialInfoFormProps> = ({ onSubmit, defaultValues }) => {
  // Initialize the form with react-hook-form and yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues || {},
  });

  // Watch the fields to trigger re-render when they change
  const watchedMaritalStatus = watch('maritalStatus');
  const watchedEmploymentStatus = watch('employmentStatus');
  const watchedHousingStatus = watch('housingStatus');

  // Reset form when defaultValues change to ensure selects are properly populated
  React.useEffect(() => {
    if (defaultValues) {
      // Reset the entire form with new default values
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  // Ensure the select values are properly set when defaultValues change
 React.useEffect(() => {
    if (defaultValues?.maritalStatus) {
      setValue('maritalStatus', defaultValues.maritalStatus);
    }
    if (defaultValues?.employmentStatus) {
      setValue('employmentStatus', defaultValues.employmentStatus);
    }
    if (defaultValues?.housingStatus) {
      setValue('housingStatus', defaultValues.housingStatus);
    }
  }, [defaultValues?.maritalStatus, defaultValues?.employmentStatus, defaultValues?.housingStatus, setValue]);

  // Handle form submission
  const handleFormSubmit = (data: FormData) => {
    console.log('Family & Financial Info Data:', data);
    onSubmit(data);
    reset(); // Reset form after successful submission
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
          component="h2"
          gutterBottom
          align="center"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
            mb: { xs: 2, md: 3 }
          }}
        >
          Family & Financial Info
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2, md: 2 } }}>
            {/* Marital Status Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.maritalStatus}
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
              >
                <InputLabel>Marital Status</InputLabel>
                <Select
                  {...register('maritalStatus')}
                  label="Marital Status"
                  value={watchedMaritalStatus || defaultValues?.maritalStatus || ''}
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="married">Married</MenuItem>
                  <MenuItem value="divorced">Divorced</MenuItem>
                  <MenuItem value="widowed">Widowed</MenuItem>
                </Select>
                {errors.maritalStatus && (
                  <FormHelperText>{errors.maritalStatus.message}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Dependents Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label="Dependents"
                type="number"
                {...register('dependents', { valueAsNumber: true })}
                error={!!errors.dependents}
                helperText={errors.dependents?.message}
                variant="outlined"
                inputProps={{ min: 0 }}
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

            {/* Employment Status Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.employmentStatus}
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
              >
                <InputLabel>Employment Status</InputLabel>
                <Select
                  {...register('employmentStatus')}
                  label="Employment Status"
                  value={watchedEmploymentStatus || defaultValues?.employmentStatus || ''}
                >
                  <MenuItem value="employed">Employed</MenuItem>
                  <MenuItem value="unemployed">Unemployed</MenuItem>
                  <MenuItem value="self-employed">Self-Employed</MenuItem>
                  <MenuItem value="retired">Retired</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                </Select>
                {errors.employmentStatus && (
                  <FormHelperText>{errors.employmentStatus.message}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Monthly Income Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label="Monthly Income ($)"
                type="number"
                {...register('monthlyIncome', { valueAsNumber: true })}
                error={!!errors.monthlyIncome}
                helperText={errors.monthlyIncome?.message}
                variant="outlined"
                inputProps={{ min: 0 }}
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

            {/* Housing Status Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.housingStatus}
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
              >
                <InputLabel>Housing Status</InputLabel>
                <Select
                  {...register('housingStatus')}
                  label="Housing Status"
                  value={watchedHousingStatus || defaultValues?.housingStatus || ''}
                >
                  <MenuItem value="own">Own</MenuItem>
                  <MenuItem value="rent">Rent</MenuItem>
                  <MenuItem value="with-family-friends">Living with Family/Friends</MenuItem>
                  <MenuItem value="temporary">Temporary Accommodation</MenuItem>
                  <MenuItem value="homeless">Homeless</MenuItem>
                </Select>
                {errors.housingStatus && (
                  <FormHelperText>{errors.housingStatus.message}</FormHelperText>
                )}
              </FormControl>
            </Box>

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

export default FamilyFinancialInfoForm;