import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRewardIdeas = async (name: string, points: number): Promise<string> => {
  try {
    const prompt = `
      I have a child named ${name} who has earned ${points} "Parent Points" for good behavior.
      Please suggest 3 fun, simple, and age-appropriate rewards or activities they could redeem these points for.
      Keep the tone enthusiastic, encouraging, and brief.
      Format the output as a simple list.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for faster simple responses
      }
    });

    return response.text || "Could not generate rewards at this time.";
  } catch (error) {
    console.error("Error generating rewards:", error);
    return "Sorry, I couldn't come up with rewards right now. Please try again later.";
  }
};