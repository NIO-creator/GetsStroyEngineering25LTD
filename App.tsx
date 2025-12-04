import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { TRANSLATIONS, NAV_ITEMS, SERVICES, Icons } from './constants';
import { Language } from './types';
import ChatWidget from './components/ChatWidget';

function App() {
  const [lang, setLang] = useState<Language>('bg');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // --- EMAILJS CONFIGURATION ---
  // REPLACE THESE VALUES WITH YOUR ACTUAL KEYS FROM EMAILJS DASHBOARD
  const YOUR_SERVICE_ID = 'YOUR_SERVICE_ID';
  const YOUR_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  const YOUR_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

  // Form State
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const t = TRANSLATIONS;

  const toggleLang = () => {
    setLang(prev => prev === 'bg' ? 'en' : 'bg');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.current) return;

    setStatus('sending');

    emailjs.sendForm(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, form.current, YOUR_PUBLIC_KEY)
      .then((result) => {
          console.log(result.text);
          setStatus('success');
          // Clear the form
          if (form.current) form.current.reset();
          // Reset status message after 3 seconds
          setTimeout(() => setStatus('idle'), 3000);
      }, (error) => {
          console.log(error.text);
          setStatus('error');
      });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gs-gray">
      {/* Navigation */}
      <header className="fixed w-full top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gs-dark p-2 rounded">
               {/* Logo Placeholder */}
               <span className="text-gs-accent font-bold text-xl">GS25</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-gs-dark font-bold text-lg leading-tight">GetsStroy</h1>
              <p className="text-xs text-gray-500 font-medium tracking-widest">ENGINEERING 25</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <a 
                key={item.key} 
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm font-medium text-gs-dark hover:text-gs-accent transition-colors uppercase tracking-wide cursor-pointer"
              >
                {t[item.key][lang]}
              </a>
            ))}
            <button 
              onClick={toggleLang}
              className="px-3 py-1 border border-gs-gray rounded text-xs font-bold hover:bg-gs-gray hover:text-white transition-colors"
            >
              {lang.toUpperCase()}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gs-dark p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
            <div className="flex flex-col p-4 space-y-4">
              {NAV_ITEMS.map((item) => (
                <a 
                  key={item.key} 
                  href={item.href}
                  className="text-gs-dark font-medium py-2 border-b border-gray-50 cursor-pointer"
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {t[item.key][lang]}
                </a>
              ))}
              <button 
                onClick={() => { toggleLang(); setMobileMenuOpen(false); }}
                className="text-left font-bold text-gs-accent py-2"
              >
                Switch to {lang === 'bg' ? 'English' : 'Български'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative h-[90vh] flex items-center justify-center overflow-hidden scroll-mt-20">
        {/* Background Image Placeholder */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: 'url("https://picsum.photos/1920/1080?grayscale&blur=2")',
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gs-dark/70"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up">
            {t['hero_title'][lang]}
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            {t['hero_subtitle'][lang]}
          </p>
          <a 
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="inline-block bg-gs-accent text-white px-8 py-4 rounded font-bold text-lg hover:bg-amber-600 transition-transform transform hover:-translate-y-1 shadow-lg cursor-pointer"
          >
            {t['hero_cta'][lang]}
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gs-dark mb-4 relative inline-block">
              {t['services_title'][lang]}
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gs-accent"></span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service) => (
              <div key={service.id} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-4 border-gs-accent group">
                <div className="text-gs-dark mb-6 group-hover:text-gs-accent transition-colors">
                  {service.icon}
                </div>
                <h4 className="text-xl font-bold text-gs-dark mb-3">
                  {t[service.titleKey][lang]}
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {t[service.descKey][lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Gallery */}
      <section id="gallery" className="py-20 bg-white scroll-mt-24">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-gs-dark mb-12 text-center">
            {t['gallery_title'][lang]}
          </h3>

          <div className="collage-grid gap-4">
            {/* Generating 8 placeholder items mixed horizontal/vertical */}
            <div className="collage-item relative group overflow-hidden rounded bg-gray-200">
               <img src="https://picsum.photos/600/400?random=1" alt="Project 1" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               <div className="absolute inset-0 bg-gs-dark/0 group-hover:bg-gs-dark/50 transition-colors flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 font-bold">Project 01</span>
               </div>
            </div>
            <div className="collage-item vertical relative group overflow-hidden rounded bg-gray-200">
               <img src="https://picsum.photos/400/800?random=2" alt="Project 2" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
             <div className="collage-item relative group overflow-hidden rounded bg-gray-200">
               <img src="https://picsum.photos/600/400?random=3" alt="Project 3" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
             <div className="collage-item horizontal relative group overflow-hidden rounded bg-gray-200">
               <img src="https://picsum.photos/800/400?random=4" alt="Project 4" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
             <div className="collage-item relative group overflow-hidden rounded bg-gray-200">
               <img src="https://picsum.photos/600/400?random=5" alt="Project 5" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
             <div className="collage-item vertical relative group overflow-hidden rounded bg-gray-200">
               <img src="https://picsum.photos/400/800?random=6" alt="Project 6" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
             <div className="collage-item relative group overflow-hidden rounded bg-gray-200">
               <img src="https://picsum.photos/600/400?random=7" alt="Project 7" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
             <div className="collage-item relative group overflow-hidden rounded bg-gray-200">
               <img src="https://picsum.photos/600/400?random=8" alt="Project 8" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-20 bg-gs-dark text-white relative overflow-hidden scroll-mt-24">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gs-accent opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="md:w-1/2">
             <img src="https://picsum.photos/800/600?grayscale" alt="Team" className="rounded-lg shadow-2xl border-4 border-gs-gray" />
          </div>
          <div className="md:w-1/2">
            <h3 className="text-3xl font-bold text-gs-accent mb-6">
              {t['about_title'][lang]}
            </h3>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              {t['about_text'][lang]}
            </p>
            <div className="bg-white/10 p-6 rounded-lg border-l-4 border-gs-accent">
              <p className="italic text-white font-medium">
                "{t['about_mission'][lang]}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 scroll-mt-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            
            <div className="bg-gs-dark text-white p-10 md:w-2/5 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">{t['contact_title'][lang]}</h3>
                <p className="text-gray-400 text-sm mb-8">GetsStroy Engineering 25 LTD</p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-gs-accent">📍</span>
                    <span className="text-sm text-gray-300">{t['contact_address'][lang]}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gs-accent">📞</span>
                    <span className="text-sm text-gray-300">+359 888 123 456</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gs-accent">✉️</span>
                    <span className="text-sm text-gray-300">office@getsstroy.bg</span>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                  {/* Social Placeholders */}
                  <div className="flex space-x-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full hover:bg-gs-accent cursor-pointer transition-colors"></div>
                    <div className="w-8 h-8 bg-white/20 rounded-full hover:bg-gs-accent cursor-pointer transition-colors"></div>
                    <div className="w-8 h-8 bg-white/20 rounded-full hover:bg-gs-accent cursor-pointer transition-colors"></div>
                  </div>
              </div>
            </div>

            <div className="p-10 md:w-3/5">
              <form ref={form} onSubmit={sendEmail} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t['contact_name'][lang]}</label>
                  <input 
                    type="text" 
                    name="user_name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gs-accent focus:border-transparent outline-none bg-gray-50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t['contact_email'][lang]}</label>
                  <input 
                    type="email" 
                    name="user_email" 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gs-accent focus:border-transparent outline-none bg-gray-50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t['contact_message'][lang]}</label>
                  <textarea 
                    name="message" 
                    rows={4} 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gs-accent focus:border-transparent outline-none bg-gray-50"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={status === 'sending'}
                  className={`w-full font-bold py-3 rounded transition-colors ${
                    status === 'sending' 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-gs-dark text-white hover:bg-opacity-90'
                  }`}
                >
                  {status === 'sending' ? 'Sending...' : t['contact_send'][lang]}
                </button>

                {status === 'success' && (
                  <p className="text-green-600 text-center text-sm font-bold mt-2">
                    {lang === 'bg' ? 'Съобщението е изпратено успешно!' : 'Message sent successfully!'}
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-red-600 text-center text-sm font-bold mt-2">
                    {lang === 'bg' ? 'Грешка при изпращане. Моля, опитайте отново.' : 'Error sending message. Please try again.'}
                  </p>
                )}

              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gs-dark text-gray-400 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} GetsStroy Engineering 25 LTD. {t['footer_rights'][lang]}
          </p>
          <div className="flex items-center space-x-6 text-sm">
             <a href="#" className="hover:text-white">Privacy Policy</a>
             <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <ChatWidget lang={lang} />
    </div>
  );
}

export default App;