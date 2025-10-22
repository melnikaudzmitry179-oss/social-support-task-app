import type { SituationDescriptionsFormData } from "../types/formTypes";
import { t } from "../utils/i18n.util";

const OPENAI_API_URL = "/api/openai/chat/completions";
const OPENAI_MODEL = "glm-4.6";

type FieldName = keyof SituationDescriptionsFormData;

interface GenerateTextParams {
  fieldName: FieldName;
  currentValue?: string;
  timeout?: number;
}

class OpenAIService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  }

  /**
   * Generates text content for a specific field using OpenAI API
   * @param fieldName The field name to generate content for
   * @param currentValue Current value in the field (if any)
   * @param timeout Request timeout in milliseconds (default: 10000ms)
   * @returns Generated text content
   */
  async generateText({
    fieldName,
    currentValue,
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
          prompt = `${t("aiPrompts.currentFinancialSituation")} ${t("aiPrompts.expandPrompt", { currentValue })}`;
        } else {
          prompt = t("aiPrompts.currentFinancialSituation");
        }
        break;
      case "employmentCircumstances":
        if (currentValue && currentValue.trim() !== "") {
          prompt = `${t("aiPrompts.employmentCircumstances")} ${t("aiPrompts.expandPrompt", { currentValue })}`;
        } else {
          prompt = t("aiPrompts.employmentCircumstances");
        }
        break;
      case "reasonForApplying":
        if (currentValue && currentValue.trim() !== "") {
          prompt = `${t("aiPrompts.reasonForApplying")} ${t("aiPrompts.expandPromptShort", { currentValue })}`;
        } else {
          prompt = t("aiPrompts.reasonForApplying");
        }
        break;
      default:
        throw new Error(`Unknown field name: ${fieldName}`);
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
}

export const openAIService = new OpenAIService();
