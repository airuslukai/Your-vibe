
import { GoogleGenAI, Type } from "@google/genai";
import { LoveLetterConfig } from "../types";

export const generateLoveLetter = async (config: LoveLetterConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Write a deeply romantic, high-end ${config.vibe} love letter to ${config.name}. 
  Mention that I admire their ${config.favoriteTrait}. 
  The tone should be "extreme love vibe" and incredibly poetic. 
  Keep it soul-stirring and beautiful.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 5000 },
        temperature: 0.9,
      }
    });

    return response.text || "My words fail me when I think of you, but my heart knows only your name.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "In every breath, in every heartbeat, I find myself drifting closer to the thought of you. You are my light, my muse, my everything.";
  }
};

export const analyzePhoto = async (base64Image: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = "Describe the beauty and radiant energy of the person in this photo in a very romantic, poetic way. Use metaphor and high-end vocabulary.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      }
    });
    return response.text || "A vision of grace and beauty that transcends words.";
  } catch (error) {
    return "Your radiance outshines the stars themselves.";
  }
};
