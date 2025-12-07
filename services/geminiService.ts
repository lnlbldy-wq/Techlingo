import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchTermDefinition = async (term: string): Promise<AiResponse | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Explain the technical term "${term}" for a middle school student in simple Arabic.
      If the term is not technical or computer related, return a polite message in the definition saying it's not found.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            arabicTerm: {
              type: Type.STRING,
              description: "The Arabic translation of the term",
            },
            definition: {
              type: Type.STRING,
              description: "A simple explanation in Arabic suitable for students",
            },
            example: {
              type: Type.STRING,
              description: "A real-world simple example in Arabic",
            },
            category: {
              type: Type.STRING,
              description: "The category of the term (e.g., Programming, AI, Hardware, General)",
            },
          },
          required: ["arabicTerm", "definition", "example", "category"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AiResponse;
    }
    return null;
  } catch (error) {
    console.error("Error fetching definition from Gemini:", error);
    return null;
  }
};

export const generateCode = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert programmer assistant for students.
      The user will ask you to write code.
      Task: Write clean, error-free, and well-commented code for the following request: "${prompt}".
      
      Requirements:
      1. Provide ONLY the code and very brief comments.
      2. Do not wrap the output in markdown code blocks (like \`\`\`), just return the raw text/code so I can display it directly.
      3. If the language is not specified, infer it or default to Python or HTML/JS depending on context.
      4. Ensure the code works 100%.`,
    });
    return response.text || null;
  } catch (error) {
    console.error("Error generating code:", error);
    return null;
  }
};