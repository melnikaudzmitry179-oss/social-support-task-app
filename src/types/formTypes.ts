export interface PersonalInfoFormData {
  name: string;
  nationalId: string;
  dateOfBirth?: Date | null | undefined;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
}

export interface FamilyFinancialInfoFormData {
  maritalStatus: string;
  dependents: number;
  employmentStatus: string;
  monthlyIncome: number;
  monthlyIncomeCurrency: 'USD' | 'AED';
  housingStatus: string;
}

export interface SituationDescriptionsFormData {
  currentFinancialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
}

export interface FormData {
  personalInfo: PersonalInfoFormData;
  familyFinancialInfo: FamilyFinancialInfoFormData;
  situationDescriptions: SituationDescriptionsFormData;
}

export interface FormRef {
  submitForm: () => Promise<boolean>;
  saveForm?: () => Promise<boolean>;
};

export interface LocalStorageFormData {
  personalInfo: {
    name: string;
    nationalId: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
  } | null;
  familyFinancialInfo: {
    maritalStatus: string;
    dependents: number;
    employmentStatus: string;
    monthlyIncome: number;
    housingStatus: string;
  } | null;
  situationDescriptions: {
    currentFinancialSituation: string;
    employmentCircumstances: string;
    reasonForApplying: string;
  } | null;
}