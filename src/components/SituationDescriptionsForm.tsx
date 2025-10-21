import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { useSocialSupportWizard } from '../context/useSocialSupportWizard';

// Define the validation schema using Yup with translated error messages
const getSchema = (t: (key: string) => string) => yup.object({
  currentFinancialSituation: yup.string().required(t('validation.currentFinancialSituationRequired')),
  employmentCircumstances: yup.string().required(t('validation.employmentCircumstancesRequired')),
  reasonForApplying: yup.string().required(t('validation.reasonForApplyingRequired')),
}).required();

// Define the form data type
export type FormData = yup.InferType<ReturnType<typeof getSchema>>;

interface SituationDescriptionsFormProps {
  onSubmit: (data: FormData) => void;
  onBack?: () => void;
  defaultValues?: Partial<FormData>;
}

const SituationDescriptionsForm: React.FC<SituationDescriptionsFormProps> = ({ onSubmit, onBack, defaultValues }) => {
  const { updateSituationDescriptions } = useSocialSupportWizard();
  const { t } = useTranslation();
  
  // Initialize the form with react-hook-form and yup validation
  const schema = getSchema(t);
  const {
    register,
    handleSubmit,
    getValues,
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

  // Handle save without submitting
  const handleSave = () => {
    // Get current form values using getValues method
    const currentData = {
      currentFinancialSituation: getValues('currentFinancialSituation'),
      employmentCircumstances: getValues('employmentCircumstances'),
      reasonForApplying: getValues('reasonForApplying'),
    };
    updateSituationDescriptions(currentData);
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
          {t('situationDescriptionsForm.title')}
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2, md: 2 } }}>
            {/* Current Financial Situation Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label={t('situationDescriptionsForm.currentFinancialSituation')}
                multiline
                rows={4}
                {...register('currentFinancialSituation')}
                error={!!errors.currentFinancialSituation}
                helperText={errors.currentFinancialSituation?.message}
                variant="outlined"
                InputLabelProps={{
                  htmlFor: "current-financial-situation-input",
                  shrink: true,
                }}
                id="current-financial-situation-input"
                inputProps={{
                  'aria-describedby': errors.currentFinancialSituation ? 'current-financial-situation-error' : undefined
                }}
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
            {errors.currentFinancialSituation && (
              <Typography
                id="current-financial-situation-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.currentFinancialSituation.message}
              </Typography>
            )}

            {/* Employment Circumstances Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label={t('situationDescriptionsForm.employmentCircumstances')}
                multiline
                rows={4}
                {...register('employmentCircumstances')}
                error={!!errors.employmentCircumstances}
                helperText={errors.employmentCircumstances?.message}
                variant="outlined"
                InputLabelProps={{
                  htmlFor: "employment-circumstances-input",
                  shrink: true,
                }}
                id="employment-circumstances-input"
                inputProps={{
                  'aria-describedby': errors.employmentCircumstances ? 'employment-circumstances-error' : undefined
                }}
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
            {errors.employmentCircumstances && (
              <Typography
                id="employment-circumstances-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.employmentCircumstances.message}
              </Typography>
            )}

            {/* Reason for Applying Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label={t('situationDescriptionsForm.reasonForApplying')}
                multiline
                rows={4}
                {...register('reasonForApplying')}
                error={!!errors.reasonForApplying}
                helperText={errors.reasonForApplying?.message}
                variant="outlined"
                InputLabelProps={{
                  htmlFor: "reason-for-applying-input",
                  shrink: true,
                }}
                id="reason-for-applying-input"
                inputProps={{
                  'aria-describedby': errors.reasonForApplying ? 'reason-for-applying-error' : undefined
                }}
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
            {errors.reasonForApplying && (
              <Typography
                id="reason-for-applying-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.reasonForApplying.message}
              </Typography>
            )}

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
                aria-label={t('situationDescriptionsForm.back')}
              >
                {t('situationDescriptionsForm.back')}
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 2 }
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSave}
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1.5, sm: 1 }
                  }}
                  aria-label={t('situationDescriptionsForm.save')}
                >
                  {t('situationDescriptionsForm.save')}
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
                  aria-label={t('situationDescriptionsForm.submitApplication')}
                >
                  {t('situationDescriptionsForm.submitApplication')}
                </Button>
              </Box>
            </Box>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default SituationDescriptionsForm;