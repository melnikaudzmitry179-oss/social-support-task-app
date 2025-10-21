import { useContext } from 'react';
import { SocialSupportWizardContext } from './SocialSupportWizardContext';

// Re-defining the types here to avoid circular dependencies
interface FormData {
  personalInfo: {
    name: string;
    nationalId: string;
    dateOfBirth: Date;
    gender: string;
    address: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
  };
  familyFinancialInfo: {
    maritalStatus: string;
    dependents: number;
    employmentStatus: string;
    monthlyIncome: number;
    housingStatus: string;
  };
  situationDescriptions: {
    currentFinancialSituation: string;
    employmentCircumstances: string;
    reasonForApplying: string;
  };
}

interface SocialSupportWizardContextType {
  formData: FormData;
  updatePersonalInfo: (data: Partial<FormData['personalInfo']>) => void;
  updateFamilyFinancialInfo: (data: Partial<FormData['familyFinancialInfo']>) => void;
  updateSituationDescriptions: (data: Partial<FormData['situationDescriptions']>) => void;
  resetFormData: () => void;
}

export const useSocialSupportWizard = (): SocialSupportWizardContextType => {
  const context = useContext(SocialSupportWizardContext);
  if (!context) {
    throw new Error('useSocialSupportWizard must be used within a SocialSupportWizardProvider');
  }
  return context;
};