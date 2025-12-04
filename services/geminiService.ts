// We use import.meta.env to access environment variables in Vite
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
import { Language } from '../types';

// 1. Restore the Personality Logic
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
     
    ВАЖНО: Ако потребителят попита за контакти или иска оферта, предостави следните детайли:
    ${contactDetailsBg}
     
    Силно насърчавай клиентите да попълнят формата за контакт по-горе на страницата за най-бърз отговор.
    Отговаряй учтиво, професионално и кратко.`;
  } else {
    return `You are a helpful AI assistant for the construction company "GetsStroy Engineering 25 LTD". 
    Services include: Roof repairs, seamless gutters, downspouts, facade panels. 
     
    IMPORTANT: If the user asks for contact info or a quote, provide these details:
    ${contactDetailsEn}
     
    Strongly encourage clients to fill out the contact form above on the page for the fastest response.
    Answer politely, professionally, and concisely.`;
  }
};

// 2. The Robust "Fetch" Function (Crash-Proof + Personality)
// Note: We need to pass 'lang' here now to get the right personality
export const sendMsgToGemini = async (message: string, lang: Language = 'bg') => {
  if (!API_KEY) {
    console.error("Gemini API key is missing.");
    return "Error: API key missing.";
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // RESTORED: This tells the AI who it is (Personality)
        systemInstruction: {
          parts: [{ text: getSystemInstruction(lang) }]
        },
        // SAFE CONTENTS: We send only the current user message to avoid the "First content must be user" crash.
        // The system instruction provides enough context for a simple Q&A.
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
      }),
    });

    if (!response.ok) {
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
