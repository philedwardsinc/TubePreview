import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize with empty key if not present, handled gracefully in UI if call is attempted without env
const ai = new GoogleGenAI({ apiKey });

export const generateTitleIdeas = async (topic: string, currentTitle?: string): Promise<string[]> => {
  if (!apiKey) {
    console.warn("API Key is missing");
    return ["API Key Missing", "Check configuration", "To use AI features"];
  }

  try {
    const prompt = `
      You are a YouTube growth expert. Generate 4 viral, high-CTR (Click Through Rate) video titles based on the following topic or draft title.
      Keep them under 60 characters if possible. Use strong hooks, curiosity gaps, or emotional triggers.
      
      Topic/Draft: "${topic || currentTitle || 'General Vlog'}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    if (response.text) {
      const titles = JSON.parse(response.text);
      return Array.isArray(titles) ? titles : [];
    }
    return [];

  } catch (error) {
    console.error("Error generating titles:", error);
    return ["Error generating titles", "Try again later"];
  }
};
