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
}

const FamilyFinancialInfoForm: React.FC<FamilyFinancialInfoFormProps> = ({ onSubmit }) => {
 // Initialize the form with react-hook-form and yup validation
 const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const handleFormSubmit = (data: FormData) => {
    console.log('Family & Financial Info Data:', data);
    onSubmit(data);
    reset(); // Reset form after successful submission
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Family & Financial Info
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Marital Status Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <FormControl fullWidth variant="outlined" error={!!errors.maritalStatus}>
                <InputLabel>Marital Status</InputLabel>
                <Select
                  {...register('maritalStatus')}
                  label="Marital Status"
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
              />
            </Box>

            {/* Employment Status Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <FormControl fullWidth variant="outlined" error={!!errors.employmentStatus}>
                <InputLabel>Employment Status</InputLabel>
                <Select
                  {...register('employmentStatus')}
                  label="Employment Status"
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
              />
            </Box>

            {/* Housing Status Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <FormControl fullWidth variant="outlined" error={!!errors.housingStatus}>
                <InputLabel>Housing Status</InputLabel>
                <Select
                  {...register('housingStatus')}
                  label="Housing Status"
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

export default FamilyFinancialInfoForm;