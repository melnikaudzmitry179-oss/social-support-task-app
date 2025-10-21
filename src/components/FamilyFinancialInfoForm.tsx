import React, { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
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
  maritalStatus: yup.string().required(t('validation.maritalStatusRequired')),
  dependents: yup.number().min(0, t('validation.dependentsMin')).required(t('validation.dependentsRequired')),
  employmentStatus: yup.string().required(t('validation.employmentStatusRequired')),
  monthlyIncome: yup.number().min(0, t('validation.monthlyIncomeMin')).required(t('validation.monthlyIncomeRequired')),
  housingStatus: yup.string().required(t('validation.housingStatusRequired')),
}).required();

// Define the form data type
export type FormData = yup.InferType<ReturnType<typeof getSchema>>;

interface FamilyFinancialInfoFormProps {
  defaultValues?: Partial<FormData>;
}

const FamilyFinancialInfoForm = forwardRef<FormRef, FamilyFinancialInfoFormProps>(({ defaultValues }, ref) => {
  const { t } = useTranslation();
  const { updateFamilyFinancialInfo } = useSocialSupportWizard();
  
  // Initialize the form with react-hook-form and yup validation
  const schema = getSchema(t);
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
    // Update the context with form data
    updateFamilyFinancialInfo(data);
  };

  // Expose the submitForm function via ref
  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      try {
        await handleSubmit(handleFormSubmit)();
        return true;
      } catch {
        return false;
      }
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
          component="h2"
          gutterBottom
          align="center"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
            mb: { xs: 2, md: 3 }
          }}
        >
          {t('familyFinancialInfoForm.title')}
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate autoComplete="off">
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
                id="marital-status-form-control"
              >
                <InputLabel htmlFor="marital-status-select">{t('familyFinancialInfoForm.maritalStatus')}</InputLabel>
                <Select
                  {...register('maritalStatus')}
                  label={t('familyFinancialInfoForm.maritalStatus')}
                  value={watchedMaritalStatus || defaultValues?.maritalStatus || ''}
                  inputProps={{
                    id: 'marital-status-select',
                    'aria-describedby': errors.maritalStatus ? 'marital-status-error' : undefined
                  }}
                >
                  <MenuItem value="single">{t('familyFinancialInfoForm.maritalStatusOptions.single')}</MenuItem>
                  <MenuItem value="married">{t('familyFinancialInfoForm.maritalStatusOptions.married')}</MenuItem>
                  <MenuItem value="divorced">{t('familyFinancialInfoForm.maritalStatusOptions.divorced')}</MenuItem>
                  <MenuItem value="widowed">{t('familyFinancialInfoForm.maritalStatusOptions.widowed')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {errors.maritalStatus && (
              <Typography
                id="marital-status-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.maritalStatus.message}
              </Typography>
            )}

            {/* Dependents Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label={t('familyFinancialInfoForm.dependents')}
                type="number"
                {...register('dependents', { valueAsNumber: true })}
                error={!!errors.dependents}
                helperText={errors.dependents?.message}
                variant="outlined"
                InputLabelProps={{
                  htmlFor: "dependents-input",
                  shrink: true,
                }}
                id="dependents-input"
                inputProps={{
                  min: 0,
                  'aria-describedby': errors.dependents ? 'dependents-error' : undefined
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
            {errors.dependents && (
              <Typography
                id="dependents-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.dependents.message}
              </Typography>
            )}

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
                id="employment-status-form-control"
              >
                <InputLabel htmlFor="employment-status-select">{t('familyFinancialInfoForm.employmentStatus')}</InputLabel>
                <Select
                  {...register('employmentStatus')}
                  label={t('familyFinancialInfoForm.employmentStatus')}
                  value={watchedEmploymentStatus || defaultValues?.employmentStatus || ''}
                  inputProps={{
                    id: 'employment-status-select',
                    'aria-describedby': errors.employmentStatus ? 'employment-status-error' : undefined
                  }}
                >
                  <MenuItem value="employed">{t('familyFinancialInfoForm.employmentStatusOptions.employed')}</MenuItem>
                  <MenuItem value="unemployed">{t('familyFinancialInfoForm.employmentStatusOptions.unemployed')}</MenuItem>
                  <MenuItem value="self-employed">{t('familyFinancialInfoForm.employmentStatusOptions.selfEmployed')}</MenuItem>
                  <MenuItem value="retired">{t('familyFinancialInfoForm.employmentStatusOptions.retired')}</MenuItem>
                  <MenuItem value="student">{t('familyFinancialInfoForm.employmentStatusOptions.student')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {errors.employmentStatus && (
              <Typography
                id="employment-status-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.employmentStatus.message}
              </Typography>
            )}

            {/* Monthly Income Field */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                fullWidth
                label={t('familyFinancialInfoForm.monthlyIncome')}
                type="number"
                {...register('monthlyIncome', { valueAsNumber: true })}
                error={!!errors.monthlyIncome}
                helperText={errors.monthlyIncome?.message}
                variant="outlined"
                InputLabelProps={{
                  htmlFor: "monthly-income-input",
                  shrink: true,
                }}
                id="monthly-income-input"
                inputProps={{
                  min: 0,
                  'aria-describedby': errors.monthlyIncome ? 'monthly-income-error' : undefined
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
            {errors.monthlyIncome && (
              <Typography
                id="monthly-income-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.monthlyIncome.message}
              </Typography>
            )}

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
                id="housing-status-form-control"
              >
                <InputLabel htmlFor="housing-status-select">{t('familyFinancialInfoForm.housingStatus')}</InputLabel>
                <Select
                  {...register('housingStatus')}
                  label={t('familyFinancialInfoForm.housingStatus')}
                  value={watchedHousingStatus || defaultValues?.housingStatus || ''}
                  inputProps={{
                    id: 'housing-status-select',
                    'aria-describedby': errors.housingStatus ? 'housing-status-error' : undefined
                  }}
                >
                  <MenuItem value="own">{t('familyFinancialInfoForm.housingStatusOptions.own')}</MenuItem>
                  <MenuItem value="rent">{t('familyFinancialInfoForm.housingStatusOptions.rent')}</MenuItem>
                  <MenuItem value="with-family-friends">{t('familyFinancialInfoForm.housingStatusOptions.withFamilyFriends')}</MenuItem>
                  <MenuItem value="temporary">{t('familyFinancialInfoForm.housingStatusOptions.temporary')}</MenuItem>
                  <MenuItem value="homeless">{t('familyFinancialInfoForm.housingStatusOptions.homeless')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {errors.housingStatus && (
              <Typography
                id="housing-status-error"
                variant="caption"
                color="error"
                sx={{ pl: { xs: '14px', sm: '24px' }, mt: -0.5 }}
                role="alert"
                aria-live="polite"
              >
                {errors.housingStatus.message}
              </Typography>
            )}

          </Box>
        </form>
      </Box>
    </Container>
  );
});

export default FamilyFinancialInfoForm;