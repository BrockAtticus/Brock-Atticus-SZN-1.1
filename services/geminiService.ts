import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateSketch = async (animal1: string, animal2: string): Promise<string> => {
  try {
    const ai = getClient();
    
    // We use gemini-2.5-flash-image for generation as per guidelines for general image tasks
    const model = 'gemini-2.5-flash-image';
    
    const prompt = `Create a dark, disturbing, high-contrast black and white pencil sketch using stippling technique. The subject is a chimera hybrid of a ${animal1} and a ${animal2}. It should look like a forensic criminal suspect sketch. Rough texture, graphite aesthetic, scary, americana punk vibe. White background.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: prompt }] },
      config: {
        // No responseMimeType for image generation models like nano banana
      }
    });

    // Extract image from response parts
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data returned from Gemini");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};