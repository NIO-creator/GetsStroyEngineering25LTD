// We use import.meta.env to access environment variables in Vite
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
import { Language } from '../types';

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

export const sendMsgToGemini = async (message: string, lang: Language = 'bg') => {
  if (!API_KEY) {
    console.error("Gemini API key is missing.");
    return "Error: API key missing.";
  }

  // FINAL FIX FOR 404: Switching to the widely supported stable model name 'gemini-pro'
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
