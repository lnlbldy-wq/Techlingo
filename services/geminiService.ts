
import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse, CodeAiResponse, DevMode, TranslationResponse } from '../types';

/**
 * Creates a new GoogleGenAI instance using the API_KEY from environment variables.
 * Following guidelines to always use named parameter and direct process.env reference.
 */
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const fetchTermDefinition = async (term: string): Promise<AiResponse | null> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Senior Technical Architect. Explain: "${term}".
      Include the English technical name, Arabic definition, and a professional real-world analogy.`,
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
    // Use .text property directly as per guidelines
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("فشل الوصول للموسوعة التقنية.");
  }
};

export const translateToEnglish = async (term: string, definition: string, example: string): Promise<TranslationResponse | null> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following technical Arabic description of the term "${term}" into professional technical English:
      Definition: ${definition}
      Example: ${example}
      
      Return as JSON with keys 'enDefinition' and 'enExample'.`,
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
    // Use .text property directly as per guidelines
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("Translation Error:", error);
    throw new Error("فشل في الترجمة.");
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
      modeInstruction = "Show code evolution in 3 stages: Basic, Optimized, and Enterprise-ready.";
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
      modeInstruction = "Perform a deep code review identifying security, performance, and style issues.";
      extraSchema = {
        reviewFeedbacks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              line: { type: Type.STRING },
              comment: { type: Type.STRING },
              type: { type: Type.STRING }
            },
            required: ["line", "comment", "type"]
          }
        }
      };
      requiredFields.push("reviewFeedbacks");
    } else {
      modeInstruction = mode === 'fix' ? "Fix bugs." : mode === 'optimize' ? "Optimize performance." : "Generate code.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Role: Senior Software Engineer. 
      Action: ${modeInstruction}
      Lang/Framework: ${language} ${framework || ''}.
      Input: "${prompt}".
      
      Requirements:
      1. Explanation must be in professional Arabic.
      2. Explanation should include: Summary, Logic, and Tech Concepts.
      3. For 'evolve', provide all 3 stages.
      4. For 'review', list specific feedbacks in Arabic.`,
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
        // Thinking budget is appropriate for Gemini 3 Pro
        thinkingConfig: { thinkingBudget: 12000 }
      },
    });

    // Use .text property directly as per guidelines
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("Code Process Error:", error);
    throw new Error("حدث خطأ أثناء معالجة طلبك البرمجي.");
  }
};
