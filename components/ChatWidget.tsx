import React, { useState, useEffect, useRef } from 'react';
import { Icons, TRANSLATIONS } from '../constants';
import { Language, ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatWidgetProps {
  lang: Language;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Initial welcome message simulation
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsConnecting(true);
      // Simulate WebSocket connection delay
      setTimeout(() => {
        setIsConnecting(false);
        setMessages([
          {
            id: 'welcome',
            role: 'model',
            text: t['chat_welcome'][lang],
            timestamp: new Date(),
          },
        ]);
      }, 1500);
    }
  }, [isOpen, lang]);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any current speaking
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'bg' ? 'bg-BG' : 'en-US';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (text: string, isVoice: boolean = false) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendMessageToGemini(text, history, lang);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);

      // If the message came from voice, read the response
      if (isVoice) {
        speak(responseText);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(lang === 'bg' ? 'Вашият браузър не поддържа гласово разпознаване.' : 'Your browser does not support speech recognition.');
      return;
    }

    // If already listening, stop it manually
    if (isListening) {
      // We rely on the object to stop itself, but without a ref we can't call stop(). 
      // Ideally we would store the recognition instance in a ref, but for simple toggle behavior
      // usually start/stop is sufficient. 
      // Since we create a new instance each click, we mainly just want to start here.
      // If we wanted to cancel, we'd need to track the instance.
      // For this implementation, the "Active" state is purely visual from state.
      // We will prevent starting multiple instances.
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'bg' ? 'bg-BG' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      if (speechResult) {
        // We set input text for visual confirmation, then clear it in handleSendMessage
        // but to be smooth we can just send it.
        handleSendMessage(speechResult, true);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Could not start recognition", e);
      setIsListening(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col transition-all duration-300 transform origin-bottom-right animate-fade-in-up">
          {/* Header */}
          <div className="bg-gs-dark p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnecting ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
              <h3 className="text-white font-semibold text-sm">
                GetsStroy AI {t['chat_trigger'][lang]}
              </h3>
            </div>
            <button 
              onClick={() => {
                setIsOpen(false);
                window.speechSynthesis.cancel();
              }}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Icons.X />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 h-80 overflow-y-auto p-4 bg-gray-50 scrollbar-thin">
            {isConnecting && (
              <div className="flex justify-center items-center h-full text-gray-500 text-sm italic">
                {t['chat_connecting'][lang]}
              </div>
            )}
            
            {!isConnecting && messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gs-accent text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-200 rounded-full px-4 py-2 flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
            <button
              onClick={handleVoiceInput}
              disabled={isListening}
              className={`p-2 rounded-full transition-all duration-200 ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse shadow-md scale-110' 
                  : 'text-gray-400 hover:text-gs-dark hover:bg-gray-100'
              }`}
              title={isListening ? "Listening..." : "Voice Input"}
            >
              <Icons.Mic />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText, false)}
              placeholder={isListening ? (lang === 'bg' ? 'Слушам...' : 'Listening...') : t['chat_placeholder'][lang]}
              disabled={isListening}
              className="flex-1 text-sm bg-gray-100 border-0 rounded-full px-4 py-2 focus:ring-2 focus:ring-gs-accent outline-none text-gray-700 disabled:opacity-70"
            />
            <button
              onClick={() => handleSendMessage(inputText, false)}
              disabled={!inputText.trim()}
              className="p-2 rounded-full bg-gs-dark text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Icons.Send />
            </button>
          </div>
          
          {/* TTS Indicator (Optional) */}
          {isSpeaking && (
             <div className="absolute top-14 right-4 text-xs text-gs-accent animate-pulse font-bold bg-white px-2 py-1 rounded shadow-sm border border-gray-100">
                🔊 Speaking...
             </div>
          )}
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-gray-500' : 'bg-gs-accent'} text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center`}
      >
        {isOpen ? <Icons.X /> : <Icons.Chat />}
      </button>
    </div>
  );
};

export default ChatWidget;