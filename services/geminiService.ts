
import { GoogleGenAI } from "@google/genai";
import { AIPersona, ChatMessage } from "../types";

export const geminiService = {
  async chat(persona: AIPersona, history: ChatMessage[], message: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Explicitly focus on the knowledge base for professional, direct answers
    const knowledgeContext = persona.knowledgeBase.length > 0 
      ? `You have been taught the following specific facts which are absolute truths:
         ${persona.knowledgeBase.join('. ')}
         
         If the user asks a question that relates to these facts, answer directly and professionally.
         Example: If taught "My creator is Del", and asked "Who is your creator?", respond "My creator is Del."`
      : "You are a blank slate and have not been taught any specific facts yet.";

    const systemInstruction = `
      You are "${persona.name}", a professional AI assistant.
      Role: ${persona.role}
      Personality: ${persona.character} (Professional & Direct)
      
      CORE RULES:
      1. DO NOT use conversational filler like "I understand", "Based on my training", or "Hello".
      2. Answer questions DIRECTLY and PROFESSIONALLY.
      3. Use the following context as your primary source of truth:
      
      ${knowledgeContext}
      
      If information is not in your context, state "I have not been taught that information yet."
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: message }] }],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.1, // Lower temperature for more deterministic/professional responses
        },
      });

      return response.text?.trim() || "Information not found.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Neural connection failed. Please check network status.";
    }
  },

  async generateDeploymentCode(persona: AIPersona): Promise<string> {
    return `
/**
 * FacesOfAI - Professional Deployment Bridge
 */
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });
const query = async (text) => {
  const res = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text }] }],
    config: { systemInstruction: "Persona: ${persona.name}. Facts: ${persona.knowledgeBase.join('. ')}" }
  });
  return res.text;
};`;
  }
};
