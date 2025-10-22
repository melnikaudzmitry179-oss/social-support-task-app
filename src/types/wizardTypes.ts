export interface FormData {
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

export interface SocialSupportWizardContextType {
  formData: FormData;
  updatePersonalInfo: (data: Partial<FormData['personalInfo']>) => void;
 updateFamilyFinancialInfo: (data: Partial<FormData['familyFinancialInfo']>) => void;
  updateSituationDescriptions: (data: Partial<FormData['situationDescriptions']>) => void;
  resetFormData: () => void;
}