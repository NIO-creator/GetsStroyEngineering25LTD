import React from 'react';
import { TranslationDictionary, ServiceItem, NavItem } from './types';

// Icons using SVG for "Vanilla" feel but in React
export const Icons = {
  Hammer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Roof: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Panel: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Gutter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
  Mic: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Chat: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
};

export const TRANSLATIONS: TranslationDictionary = {
  nav_home: { bg: 'Начало', en: 'Home' },
  nav_services: { bg: 'Услуги', en: 'Services' },
  nav_projects: { bg: 'Проекти', en: 'Projects' },
  nav_about: { bg: 'За Нас', en: 'About Us' },
  nav_contact: { bg: 'Контакти', en: 'Contact' },
  
  hero_title: { bg: 'Качество, Прецизност, Издръжливост.', en: 'Quality, Precision, Durability.' },
  hero_subtitle: { bg: 'Вашият надежден партньор в строителството и покривните решения.', en: 'Your trusted partner in construction and roofing solutions.' },
  hero_cta: { bg: 'Свържете се с нас', en: 'Get in Touch' },

  services_title: { bg: 'Нашите Услуги', en: 'Our Services' },
  srv_1_title: { bg: 'Водосточни системи', en: 'Downspouts & Flashings' },
  srv_1_desc: { bg: 'Производство и монтаж на водосточни тръби и обшивки с мобилен абкант.', en: 'Production and installation of downspouts and flashings using a mobile folding machine.' },
  srv_2_title: { bg: 'Покривни Ремонти', en: 'Roof Repair & Build' },
  srv_2_desc: { bg: 'Цялостен ремонт и изграждане на покривни конструкции.', en: 'Complete repair and construction of roof structures.' },
  srv_3_title: { bg: 'Фасадни Панели', en: 'Facade Panels' },
  srv_3_desc: { bg: 'Изработка и монтаж на покривни и фасадни панели (двоен фалц).', en: 'Fabrication and installation of roof and facade panels (double seam).' },
  srv_4_title: { bg: 'Безшевни Улуци', en: 'Seamless Gutters' },
  srv_4_desc: { bg: 'Производство и монтаж на безшевни улуци с мобилна машина.', en: 'Production and installation of seamless gutters with a mobile machine.' },

  gallery_title: { bg: 'Галерия Проекти', en: 'Project Gallery' },

  about_title: { bg: 'За Гецстрой Енжинеринг 25', en: 'About GetsStroy Engineering 25' },
  about_text: { bg: 'Ние сме лидер в иновативните покривни решения. С дългогодишен опит и модерно техническо оборудване, ние гарантираме качество без компромис.', en: 'We are a leader in innovative roofing solutions. With years of experience and modern technical equipment, we guarantee quality without compromise.' },
  about_mission: { bg: 'Нашата мисия е да предоставим устойчивост и естетика за всеки дом и сграда.', en: 'Our mission is to provide durability and aesthetics for every home and building.' },

  contact_title: { bg: 'Контакти', en: 'Contact Us' },
  contact_name: { bg: 'Име', en: 'Name' },
  contact_email: { bg: 'Имейл', en: 'Email' },
  contact_message: { bg: 'Съобщение', en: 'Message' },
  contact_send: { bg: 'Изпрати', en: 'Send Message' },
  sending: { bg: 'Изпращане...', en: 'Sending...' },
  
  // UPDATED ADDRESS
  contact_address: { bg: 'гр. Казанлък, ул. Княз Александър Бетенберг 221', en: 'str. Kiaz Al. Batenberg 221, Kazanlak city' },
  
  // ADDED NEW CONTACT INFO VARIABLES
  contact_phone_display: { bg: '+359 898 696 213', en: '+359 898 696 213' },
  contact_email_display: { bg: 'getsstroy@abv.bg', en: 'getsstroy@abv.bg' },
  
  footer_rights: { bg: 'Всички права запазени.', en: 'All rights reserved.' },

  chat_trigger: { bg: 'Чат асистент', en: 'Chat Assistant' },
  chat_placeholder: { bg: 'Напишете въпрос...', en: 'Type a question...' },
  chat_connecting: { bg: 'Свързване със сървъра...', en: 'Connecting to server...' },
  chat_welcome: { bg: 'Здравейте! Аз съм AI асистентът на Гецстрой. Как мога да помогна?', en: 'Hello! I am the AI assistant of GetsStroy. How can I help you?' },
};

export const NAV_ITEMS: NavItem[] = [
  { key: 'nav_home', href: '#home' },
  { key: 'nav_services', href: '#services' },
  { key: 'nav_projects', href: '#gallery' },
  { key: 'nav_about', href: '#about' },
  { key: 'nav_contact', href: '#contact' },
];

export const SERVICES: ServiceItem[] = [
  { id: 1, titleKey: 'srv_1_title', descKey: 'srv_1_desc', icon: <Icons.Roof /> },
  { id: 2, titleKey: 'srv_2_title', descKey: 'srv_2_desc', icon: <Icons.Hammer /> },
  { id: 3, titleKey: 'srv_3_title', descKey: 'srv_3_desc', icon: <Icons.Panel /> },
  { id: 4, titleKey: 'srv_4_title', descKey: 'srv_4_desc', icon: <Icons.Gutter /> },
];
