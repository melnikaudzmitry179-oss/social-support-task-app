import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { FormData, SocialSupportWizardContextType } from '../types/wizardTypes';

const initialFormData: FormData = {
  personalInfo: {
    name: '',
    nationalId: '',
    dateOfBirth: new Date(),
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
  },
  familyFinancialInfo: {
    maritalStatus: '',
    dependents: 0,
    employmentStatus: '',
    monthlyIncome: 0,
    housingStatus: '',
  },
  situationDescriptions: {
    currentFinancialSituation: '',
    employmentCircumstances: '',
    reasonForApplying: '',
  },
};

const SocialSupportWizardContext = createContext<SocialSupportWizardContextType | undefined>(undefined);

export const SocialSupportWizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updatePersonalInfo = (data: Partial<FormData['personalInfo']>) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...data }
    }));
  };

  const updateFamilyFinancialInfo = (data: Partial<FormData['familyFinancialInfo']>) => {
    setFormData(prev => ({
      ...prev,
      familyFinancialInfo: { ...prev.familyFinancialInfo, ...data }
    }));
  };

  const updateSituationDescriptions = (data: Partial<FormData['situationDescriptions']>) => {
    setFormData(prev => ({
      ...prev,
      situationDescriptions: { ...prev.situationDescriptions, ...data }
    }));
  };

  const resetFormData = () => {
    setFormData(initialFormData);
  };

  return (
    <SocialSupportWizardContext.Provider value={{
      formData,
      updatePersonalInfo,
      updateFamilyFinancialInfo,
      updateSituationDescriptions,
      resetFormData
    }}>
      {children}
    </SocialSupportWizardContext.Provider>
  );
};

export { SocialSupportWizardContext };