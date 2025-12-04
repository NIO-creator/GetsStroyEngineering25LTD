import React from 'react';

export type Language = 'bg' | 'en';

export interface NavItem {
  key: string;
  href: string;
}

export interface ServiceItem {
  id: number;
  titleKey: string;
  descKey: string;
  icon: React.ReactNode;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// I renamed this from 'TranslationDictionary' to 'TranslationStructure' 
// to match the code in constants.tsx
export interface TranslationStructure {
  [key: string]: {
    bg: string;
    en: string;
  };
}
