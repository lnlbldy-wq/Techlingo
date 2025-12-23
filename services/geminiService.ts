
import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse, CodeAiResponse, DevMode, TranslationResponse } from '../types';

/**
 * Creates a new GoogleGenAI instance right before making an API call to ensure 
 * it always uses the most up-to-date API key from the dialog or environment.
 */
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const fetchTermDefinition = async (term: string): Promise<AiResponse | null> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Senior Technical Architect. Explain the term: "${term}".
      Return the English technical name, Arabic definition (simple yet professional), and a professional real-world analogy.
      Ensure the category is one of: عام، برمجة، عتاد، ذكاء اصطناعي، شبكات، سحابة.`,
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
    console.error("Gemini Search Error:", error);
    throw new Error("فشل الوصول للموسوعة العالمية. يرجى التأكد من اتصال الإنترنت.");
  }
};

export const translateToEnglish = async (term: string, definition: string, example: string): Promise<TranslationResponse | null> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following technical Arabic description for "${term}" into technical English:
      Definition: ${definition}
      Example: ${example}`,
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
    console.error("Translation Error:", error);
    throw new Error("فشل في استرداد الترجمة الإنجليزية.");
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
    
    let modeInstruction = "";
    let extraSchema: any = {};
    let requiredFields = ["code", "explanation"];

    if (mode === 'evolve') {
      modeInstruction = "Provide code evolution in 3 distinct stages: Basic (MVP), Optimized (Fast/Efficient), and Enterprise (Scalable/Secure).";
      extraSchema = {
        evolution: {
          type: Type.OBJECT,
          properties: {
            basic: { type: Type.STRING },
            optimized: { type: Type.STRING },
            enterprise: { type: Type.STRING }
          },
          required: ["basic", "optimized", "enterprise"]
        }
      };
      requiredFields.push("evolution");
    } else if (mode === 'review') {
      modeInstruction = "Perform a security and performance audit on the code. Provide actionable feedback.";
    } else if (mode === 'fix') {
      modeInstruction = "Identify and fix logical or syntax errors in the provided snippet.";
    } else if (mode === 'optimize') {
      modeInstruction = "Refactor the code for maximum performance and readability.";
    } else {
      modeInstruction = "Generate clean, production-ready code based on the prompt.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Role: Senior Software Engineer / Solutions Architect.
      Context: Language is ${language}${framework ? `, Framework is ${framework}` : ''}.
      Goal: ${modeInstruction}
      Input: "${prompt}"
      
      Response Requirements:
      1. Write the 'explanation' and 'detectedErrors' in professional technical Arabic.
      2. Ensure the code follows industry best practices.
      3. Provide a list of 'improvements' for future scalability.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING },
            explanation: { type: Type.STRING },
            detectedErrors: { type: Type.STRING },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            ...extraSchema
          },
          required: requiredFields,
        },
        thinkingConfig: { thinkingBudget: 16000 }
      },
    });

    return response.text ? JSON.parse(response.text) : null;
  } catch (error: any) {
    console.error("Code Generation Error:", error);
    // Rethrow to be caught by the component
    throw error;
  }
};
