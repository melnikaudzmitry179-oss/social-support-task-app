import type { FormData } from './formTypes';

export interface SocialSupportWizardContextType {
  formData: FormData;
  updatePersonalInfo: (data: Partial<FormData['personalInfo']>) => void;
  updateFamilyFinancialInfo: (data: Partial<FormData['familyFinancialInfo']>) => void;
  updateSituationDescriptions: (data: Partial<FormData['situationDescriptions']>) => void;
  resetFormData: () => void;
}