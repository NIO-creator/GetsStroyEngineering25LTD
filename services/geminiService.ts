import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

// Helper to get system prompt based on language
const getSystemInstruction = (lang: Language): string => {
  if (lang === 'bg') {
    return `Ти си полезен AI асистент за строителна фирма "Гецстрой Енжинеринг 25 ООД". 
    Услугите включват: Покривни ремонти, безшевни улуци, водосточни тръби, фасадни панели. 
    Отговаряй учтиво, професионално и кратко. Насърчавай клиентите да се свържат за оферта.`;
  } else {
    return `You are a helpful AI assistant for the construction company "GetsStroy Engineering 25 LTD". 
    Services include: Roof repairs, seamless gutters, downspouts, facade panels. 
    Answer politely, professionally, and concisely. Encourage clients to contact for a quote.`;
  }
};

export const sendMessageToGemini = async (
  message: string, 
  history: { role: string; parts: { text: string }[] }[],
  lang: Language
): Promise<string> => {
  
  // NOTE: In a real production app, API keys should be proxied through a backend.
  // For this static demo, we access it via process.env.API_KEY as per instructions.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return lang === 'bg' 
      ? "Грешка: Липсва API ключ." 
      : "Error: Missing API key.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // We create a new model instance for each request to allow dynamic system instructions based on language
    const model = 'gemini-2.5-flash';
    
    // Using simple generateContent for single turn or manually managed history context
    // Constructing the full context to send
    const contents = [
       ...history.map(h => ({
         role: h.role === 'model' ? 'model' : 'user',
         parts: h.parts
       })),
       { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: getSystemInstruction(lang),
        temperature: 0.7,
      }
    });

    return response.text || (lang === 'bg' ? 'Съжалявам, не можах да генерирам отговор.' : 'Sorry, I could not generate a response.');

  } catch (error) {
    console.error("Gemini API Error:", error);
    return lang === 'bg' 
      ? "Възникна грешка при свързването с AI услугата." 
      : "An error occurred connecting to the AI service.";
  }
};