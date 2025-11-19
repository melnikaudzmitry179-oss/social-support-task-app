import type { SituationDescriptionsFormData, FamilyFinancialInfoFormData } from './formTypes';

export interface UseAiSuggestionParams {
  onAccept: (field: keyof SituationDescriptionsFormData, value: string) => void;
}

export interface UseAiSuggestionReturn {
  aiSuggestion: string;
  editableSuggestion: string;
  isGenerating: boolean;
  currentField: keyof SituationDescriptionsFormData | null;
  showSuggestionPopup: boolean;
  aiError: string | null;
  setEditableSuggestion: React.Dispatch<React.SetStateAction<string>>;
  setFamilyFinancialInfoForPrompt: (info: FamilyFinancialInfoFormData) => void;
  handleGenerateSuggestion: (fieldName: keyof SituationDescriptionsFormData, currentValue?: string) => Promise<void>;
  handleAcceptSuggestion: () => void;
  handleDiscardSuggestion: () => void;
}