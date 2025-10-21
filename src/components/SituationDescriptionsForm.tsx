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
          Situation Descriptions
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2, md: 2 } }}>
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
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    py: { xs: 1, sm: 1.25 }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
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
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    py: { xs: 1, sm: 1.25 }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
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
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    py: { xs: 1, sm: 1.25 }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Box>

            {/* Navigation Buttons */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                mt: 2,
                gap: { xs: 1, sm: 2 }
              }}
            >
              <Button
                variant="outlined"
                onClick={onBack || (() => {})}
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.5, sm: 1 }
                }}
              >
                Back
              </Button>
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