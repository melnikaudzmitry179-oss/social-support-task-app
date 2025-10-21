import type { SituationDescriptionsFormData } from "../types/formTypes";

const OPENAI_API_URL = "/api/openai/chat/completions"; // Using proxy endpoint to avoid CORS issues
const OPENAI_MODEL = "glm-4.6"; // Using the correct model for the Zhipu AI API

// Define the type for the field being generated
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
    timeout = 10000,
  }: GenerateTextParams): Promise<string> {
    // Check if API key is available
    if (!this.apiKey) {
      throw new Error(
        "OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY environment variable."
      );
    }

    // Create a descriptive prompt based on the field name
    let prompt = "";
    switch (fieldName) {
      case "currentFinancialSituation":
        prompt = ` ${
          currentValue
            ? `"${currentValue}". Please improve this.`
            : ""
        }`;
        break;
      case "employmentCircumstances":
        prompt = `  ${
          currentValue
            ? `"${currentValue}". Please improve this.`
            : ""
        }`;
        break;
      case "reasonForApplying":
        prompt = `Write a description of why someone is applying for social support.  ${
          currentValue
            ? `The user has already written: "${currentValue}". Please expand or improve this.`
            : ""
        }`;
        break;
      default:
        throw new Error(`Unknown field name: ${fieldName}`);
    }

    // Create the request payload
    const requestBody = {
      model: OPENAI_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      //temperature: 0.7,
      //max_tokens: 300,
    };

    // Create AbortController for timeout
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
