import type { SituationDescriptionsFormData, FamilyFinancialInfoFormData } from "../types/formTypes";
import { t } from "../utils/i18n.util";

const OPENAI_API_URL = import.meta.env.VITE_OPENAI_API_URL;
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL;

type FieldName = keyof SituationDescriptionsFormData;

interface GenerateTextParams {
  fieldName: FieldName;
  currentValue?: string;
  familyFinancialInfo?: FamilyFinancialInfoFormData | null;
  timeout?: number;
}

class OpenAIService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  }

  async generateText({
    fieldName,
    currentValue,
    familyFinancialInfo,
    timeout = 100000,
  }: GenerateTextParams): Promise<string> {
    if (!this.apiKey) {
      throw new Error(
        "OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY environment variable."
      );
    }

    let prompt = "";
    switch (fieldName) {
      case "currentFinancialSituation":
        if (currentValue && currentValue.trim() !== "") {
          prompt = `${t("aiPrompts.currentFinancialSituation")}`;
        } else {
          prompt = t("aiPrompts.currentFinancialSituation");
        }
        break;
      case "employmentCircumstances":
        if (currentValue && currentValue.trim() !== "") {
          prompt = `${t("aiPrompts.employmentCircumstances")}`;
        } else {
          prompt = t("aiPrompts.employmentCircumstances");
        }
        break;
      case "reasonForApplying":
        if (currentValue && currentValue.trim() !== "") {
          prompt = `${t("aiPrompts.reasonForApplying")}`;
        } else {
          prompt = t("aiPrompts.reasonForApplying");
        }
        break;
      default:
        throw new Error(`Unknown field name: ${fieldName}`);
    }

    if (familyFinancialInfo) {
      const financialContext = this.buildFinancialContext(familyFinancialInfo);
      prompt = `${prompt}\n\nAdditional Context:\n${financialContext}`;
    }

    const requestBody = {
      model: OPENAI_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}. ${
            errorData.error?.message || ""
          }`
        );
      }

      const data = await response.json();

      if (!data.choices || data.choices.length === 0) {
        throw new Error("No choices returned from OpenAI API");
      }

      return data.choices[0].message.content.trim();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(
            "Request timed out. The API took too long to respond."
          );
        }
        throw error;
      }

      throw new Error("An unknown error occurred while generating text");
    }
  }

  private buildFinancialContext(financialInfo: FamilyFinancialInfoFormData): string {
    
    const contextObj: Record<string, unknown> = {};
    contextObj.maritalStatus = financialInfo.maritalStatus && financialInfo.maritalStatus.trim() !== ""
      ? financialInfo.maritalStatus
      : t('notSpecified');

    contextObj.dependents = financialInfo.dependents !== undefined && financialInfo.dependents !== 0
      ? financialInfo.dependents
      : t('notSpecified');
    
   
    contextObj.employmentStatus = financialInfo.employmentStatus && financialInfo.employmentStatus.trim() !== ""
      ? financialInfo.employmentStatus
      : t('notSpecified');
    
    
    contextObj.monthlyIncome = financialInfo.monthlyIncome !== undefined && financialInfo.monthlyIncome !== 0
      ? `${financialInfo.monthlyIncome} ${financialInfo.monthlyIncomeCurrency || 'USD'}`
      : t('notSpecified');
    
    
    contextObj.housingStatus = financialInfo.housingStatus && financialInfo.housingStatus.trim() !== ""
      ? financialInfo.housingStatus
      : t('notSpecified');
    return t("aiPrompts.financialContextPrompt", contextObj);
  }
}

export const openAIService = new OpenAIService();
