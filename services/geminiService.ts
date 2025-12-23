
import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse, CodeAiResponse, DevMode, TranslationResponse } from '../types';

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const fetchTermDefinition = async (term: string): Promise<AiResponse | null> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the term: "${term}". Use Arabic for the definition and example. Real-world analogy. Category: coding, hardware, ai, etc.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            arabicTerm: { type: Type.STRING },
            definition: { type: Type.STRING },
            example: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ["arabicTerm", "definition", "example", "category"],
        },
      },
    });
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("Search Error:", error);
    throw new Error("حدث خطأ في جلب التعريف.");
  }
};

export const translateToEnglish = async (term: string, definition: string, example: string): Promise<TranslationResponse | null> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate to English: "${term}" - "${definition}" - "${example}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enDefinition: { type: Type.STRING },
            enExample: { type: Type.STRING },
          },
          required: ["enDefinition", "enExample"],
        },
      },
    });
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    throw new Error("فشل الترجمة.");
  }
};

export const processDevCode = async (
  prompt: string, 
  mode: DevMode, 
  language: string,
  framework?: string
): Promise<CodeAiResponse | null> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Switched to flash for more reliable basic performance
      contents: `Role: Senior Architect. Mode: ${mode}. Lang: ${language}. Framework: ${framework}. 
      Task: "${prompt}". Explain in Arabic.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING },
            explanation: { type: Type.STRING },
            detectedErrors: { type: Type.STRING },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["code", "explanation"],
        },
      },
    });

    return response.text ? JSON.parse(response.text) : null;
  } catch (error: any) {
    console.error("Code Error:", error);
    throw error;
  }
};
