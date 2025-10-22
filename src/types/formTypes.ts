export interface PersonalInfoFormData {
  name: string;
  nationalId: string;
  dateOfBirth: Date | string; // Can be Date object or string depending on context
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

// Define the ref type for form submission used across all forms
export interface FormRef {
  submitForm: () => Promise<boolean>; // Returns true if validation passes
  saveForm?: () => Promise<boolean>; // Optional alias for submitForm for backward compatibility
};