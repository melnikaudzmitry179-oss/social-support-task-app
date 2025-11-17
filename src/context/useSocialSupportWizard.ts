import { useContext } from 'react';
import { SocialSupportWizardContext } from './SocialSupportWizardContext';
import type { SocialSupportWizardContextType } from '../types/wizardTypes';

export const useSocialSupportWizard = (): SocialSupportWizardContextType => {
  const context = useContext(SocialSupportWizardContext);
  if (!context) {
    throw new Error('useSocialSupportWizard must be used within a SocialSupportWizardProvider');
  }
  return context;
};