import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';

// Define the validation schema using Yup
const schema = yup.object({
  currentFinancialSituation: yup.string().required('Current Financial Situation is required'),
  employmentCircumstances: yup.string().required('Employment Circumstances is required'),
  reasonForApplying: yup.string().required('Reason for Applying is required'),
}).required();

// Define the form data type
export type FormData = yup.InferType<typeof schema>;

interface SituationDescriptionsFormProps {
  onSubmit: (data: FormData) => void;
  onBack?: () => void;
  defaultValues?: Partial<FormData>;
}

const SituationDescriptionsForm: React.FC<SituationDescriptionsFormProps> = ({ onSubmit, onBack, defaultValues }) => {
  // Initialize the form with react-hook-form and yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues || {},
  });

  // Reset form when defaultValues change to ensure fields are properly populated
  React.useEffect(() => {
    reset(defaultValues || {});
  }, [defaultValues, reset]);

  // Handle form submission
  const handleFormSubmit = (data: FormData) => {
    console.log('Situation Descriptions Data:', data);
    onSubmit(data);
    reset(); // Reset form after successful submission
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Situation Descriptions
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Current Financial Situation Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label="Current Financial Situation"
                multiline
                rows={4}
                {...register('currentFinancialSituation')}
                error={!!errors.currentFinancialSituation}
                helperText={errors.currentFinancialSituation?.message}
                variant="outlined"
              />
            </Box>

            {/* Employment Circumstances Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label="Employment Circumstances"
                multiline
                rows={4}
                {...register('employmentCircumstances')}
                error={!!errors.employmentCircumstances}
                helperText={errors.employmentCircumstances?.message}
                variant="outlined"
              />
            </Box>

            {/* Reason for Applying Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label="Reason for Applying"
                multiline
                rows={4}
                {...register('reasonForApplying')}
                error={!!errors.reasonForApplying}
                helperText={errors.reasonForApplying?.message}
                variant="outlined"
              />
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={onBack || (() => {})}
              >
                Back
              </Button>
              <Button type="submit" variant="contained" color="primary" size="large">
                Submit Application
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default SituationDescriptionsForm;