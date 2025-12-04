import React, { useRef, useState } from 'react';

import emailjs from '@emailjs/browser';

import { Language } from '../types'; // Adjust path as needed



interface ContactFormProps {

  lang: Language;

  t: any; // Ideally define a proper type for your translations

}



// SECURE: Use Environment Variables

// Vite uses import.meta.env.VITE_..., CRA uses process.env.REACT_APP_...

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || process.env.REACT_APP_EMAILJS_SERVICE_ID || '';

const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '';

const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';



const ContactForm: React.FC<ContactFormProps> = ({ lang, t }) => {

  const form = useRef<HTMLFormElement>(null);

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');



  const sendEmail = (e: React.FormEvent) => {

    e.preventDefault();



    if (!form.current) return;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {

      console.error("EmailJS environment variables are missing!");

      setStatus('error');

      return;

    }



    setStatus('sending');



    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)

      .then((result) => {

          console.log('Email sent:', result.text);

          setStatus('success');

          if (form.current) form.current.reset();

          // Reset status after 5 seconds so user can send another if needed

          setTimeout(() => setStatus('idle'), 5000);

      }, (error) => {

          console.error('Email failed:', error.text);

          setStatus('error');

      });

  };



  return (

    <form ref={form} onSubmit={sendEmail} className="space-y-6">

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-1">

            {t['contact_name']?.[lang] || 'Name'}

        </label>

        <input

          type="text"

          name="user_name"

          required

          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gs-accent focus:border-transparent outline-none bg-gray-50 transition-all"

        />

      </div>

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-1">

            {t['contact_email']?.[lang] || 'Email'}

        </label>

        <input

          type="email"

          name="user_email"

          required

          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gs-accent focus:border-transparent outline-none bg-gray-50 transition-all"

        />

      </div>

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-1">

            {t['contact_message']?.[lang] || 'Message'}

        </label>

        <textarea

          name="message"

          rows={4}

          required

          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gs-accent focus:border-transparent outline-none bg-gray-50 transition-all resize-none"

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

        {status === 'sending'

            ? (t['sending']?.[lang] || 'Sending...')

            : (t['contact_send']?.[lang] || 'Send')}

      </button>



      {status === 'success' && (

        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center text-sm">

          {lang === 'bg' ? 'Съобщението е изпратено успешно!' : 'Message sent successfully!'}

        </div>

      )}

      {status === 'error' && (

        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center text-sm">

          {lang === 'bg' ? 'Грешка при изпращане. Моля, опитайте отново.' : 'Error sending message. Please try again.'}

        </div>

      )}

    </form>

  );

};



export default ContactForm;
