import type {
  PersonalInfoFormData,
  FamilyFinancialInfoFormData,
  SituationDescriptionsFormData
} from './formTypes';

// Form component props interfaces
export interface FamilyFinancialInfoFormProps {
  defaultValues?: Partial<FamilyFinancialInfoFormData>;
}

export interface PersonalInfoFormProps {
  defaultValues?: Partial<PersonalInfoFormData>;
}

export interface SituationDescriptionsFormProps {
  defaultValues?: Partial<SituationDescriptionsFormData>;
}

// Popup component props interfaces
export interface AiSuggestionPopupProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  editableSuggestion: string;
  setEditableSuggestion: React.Dispatch<React.SetStateAction<string>>;
  isGenerating: boolean;
  aiError: string | null;
}