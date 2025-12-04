/**
 * Service file for connecting to the Google Generative Language API.
 * * This file restores the full application logic (multi-language and persona)
 * while using the stable 'gemini-2.5-flash' model to avoid the previous 404 errors.
 */

// We use import.meta.env to access environment variables in Vite
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
import { Language } from '../types';

// Define the API endpoint and the stable model
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/";
const MODEL_NAME = "gemini-2.5-flash"; // Using a modern, stable, and fast model

/**
 * Generates the system instruction based on the requested language (bg or en).
 */
const getSystemInstruction = (lang: Language): string => {
  const contactDetailsBg = `
  Детайли за контакт:
  - Адрес: гр. Казанлък, ул. Княз Александър Бетенберг 221
  - Телефон: +359 898 696 213
  - Имейл: getsstroy@abv.bg
  `;

  const contactDetailsEn = `
  Contact Details:
  - Address: str. Kiaz Al. Batenberg 221, Kazanlak city
  - Phone: +359 898 696 213
  - Email: getsstroy@abv.bg
  `;

  if (lang === 'bg') {
    return `Ти си полезен AI асистент за строителна фирма "Гецстрой Енжинеринг 25 ООД". 
    Услугите включват: Покривни ремонти, безшевни улуци, водосточни тръби, фасадни панели. 
    ВАЖНО: Ако потребителят попита за контакти или иска оферта, предостави следните детайли: ${contactDetailsBg}
    Отговаряй учтиво, професионално и кратко.`;
  } else {
    return `You are a helpful AI assistant for the construction company "GetsStroy Engineering 25 LTD". 
    Services include: Roof repairs, seamless gutters, downspouts, facade panels. 
    IMPORTANT: If the user asks for contact info or a quote, provide these details: ${contactDetailsEn}
    Answer politely, professionally, and concisely.`;
  }
};

/**
 * Sends a message to the Gemini API with the full system instruction and returns the response.
 * This function now uses the gemini-2.5-flash model.
 * @param message The user's input query.
 * @param lang The language ('bg' or 'en') for the system instruction.
 * @returns The text response from the model.
 */
export const sendMsgToGemini = async (message: string, lang: Language = 'bg'): Promise<string> => {
  if (!API_KEY) {
    console.error("Gemini API key is missing.");
    return "Error: API key missing.";
  }

  const url = `${GEMINI_API_URL}${MODEL_NAME}:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Restored the system instruction logic
        systemInstruction: {
          parts: [{ text: getSystemInstruction(lang) }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error Details:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    const botResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't understand that.";

    return botResponse;
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Sorry, something went wrong. Please try again later.";
  }
};
