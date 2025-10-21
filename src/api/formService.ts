import api from './index';

interface PersonalInfoFormData {
  name: string;
  nationalId: string;
  dateOfBirth: string; // Always string when sending to API
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
 email: string;
}

interface FamilyFinancialInfoFormData {
  maritalStatus: string;
  dependents: number;
  employmentStatus: string;
  monthlyIncome: number;
 housingStatus: string;
}

interface SituationDescriptionsFormData {
  currentFinancialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
}

export interface FormData {
  personalInfo: PersonalInfoFormData;
  familyFinancialInfo: FamilyFinancialInfoFormData;
  situationDescriptions: SituationDescriptionsFormData;
}

export const submitFormData = async (formData: FormData) => {
  try {
    const response = await api.post('/submissions', formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting form data:', error);
    throw error;
  }
};