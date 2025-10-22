import { useState } from "react";
import { openAIService } from "../api/openaiService";
import type { SituationDescriptionsFormData } from "../types/formTypes";

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
  handleGenerateSuggestion: (fieldName: keyof SituationDescriptionsFormData, currentValue?: string) => Promise<void>;
  handleAcceptSuggestion: () => void;
  handleDiscardSuggestion: () => void;
}

export const useAiSuggestion = ({ onAccept }: UseAiSuggestionParams): UseAiSuggestionReturn => {
  // State for AI suggestions and popup
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [editableSuggestion, setEditableSuggestion] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentField, setCurrentField] = useState<keyof SituationDescriptionsFormData | null>(null);
  const [showSuggestionPopup, setShowSuggestionPopup] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Function to handle AI suggestion generation
 const handleGenerateSuggestion = async (fieldName: keyof SituationDescriptionsFormData, currentValue: string = "") => {
    setCurrentField(fieldName);
    setIsGenerating(true);
    setAiError(null);

    try {
      const suggestion = await openAIService.generateText({
        fieldName,
        currentValue,
        timeout: 100000, // 70 second timeout
      });
      setAiSuggestion(suggestion);
      setEditableSuggestion(suggestion);
      setShowSuggestionPopup(true);
    } catch (error) {
      console.error("Error generating AI suggestion:", error);
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      setAiError(errorMessage);
      setAiSuggestion("");
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to accept the AI suggestion
 const handleAcceptSuggestion = () => {
    if (currentField) {
      const suggestionToUse = editableSuggestion || aiSuggestion;
      if (suggestionToUse) {
        onAccept(currentField, suggestionToUse);
        setShowSuggestionPopup(false);
        setAiSuggestion("");
        setEditableSuggestion("");
        setCurrentField(null);
      }
    }
 };

  // Function to discard the suggestion
  const handleDiscardSuggestion = () => {
    setShowSuggestionPopup(false);
    setAiSuggestion("");
    setEditableSuggestion("");
    setCurrentField(null);
  };

  return {
    aiSuggestion,
    editableSuggestion,
    isGenerating,
    currentField,
    showSuggestionPopup,
    aiError,
    setEditableSuggestion,
    handleGenerateSuggestion,
    handleAcceptSuggestion,
    handleDiscardSuggestion,
  };
};