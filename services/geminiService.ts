import { GoogleGenerativeAI } from "@google/generative-ai";
import { Language } from "../types";

// Helper to get system prompt based on language
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

export const sendMessageToGemini = async (
  message: string, 
  history: { role: string; parts: { text: string }[] }[],
  lang: Language
): Promise<string> => {
  
  // --- CONFIGURATION ---
  const apiKey = 'AIzaSyDKS4WCYWdEhd4wxC8l17nfM15ihygiOEc';
  
  if (!apiKey) {
    return lang === 'bg' 
      ? "Грешка: Липсва API ключ. Моля, добавете го в кода." 
      : "Error: Missing API key. Please add it to the code.";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using stable version to prevent 404 errors (Fixed from 'gemini-1.5-flash')
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-001",
      systemInstruction: getSystemInstruction(lang),
    });
    
    // Convert history to the format Google Generative AI expects
    const chatHistory = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: h.parts
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return text || (lang === 'bg' ? 'Съжалявам, не можах да генерирам отговор.' : 'Sorry, I could not generate a response.');

  } catch (error) {
    console.error("Gemini API Error:", error);
    return lang === 'bg' 
      ? "Възникна грешка при свързването с AI услугата." 
      : "An error occurred connecting to the AI service.";
  }
};
