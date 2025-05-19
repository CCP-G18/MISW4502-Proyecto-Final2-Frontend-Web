import { Link } from "react-router";
import Breadcrumb from "./Breadcrumb";
import { useEffect } from 'react';

export default function Topbar() {

  useEffect(() => {
    const addScript = () => {
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
            pageLanguage: 'es',
            includedLanguages: 'en,es',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false, 
        }, 'google_translate_element');
    };

    addScript();
  }, []);

    const changeLanguage = (lang) => {
        const domain = window.location.hostname;
        const domainParts = domain.split('.');
        const cookieDomain = domainParts.length > 1
            ? '.' + domainParts.slice(-2).join('.')
            : domain;
        if (lang === 'es') {
            document.cookie = `googtrans=;path=/;domain=${cookieDomain};expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
            setTimeout(() => window.location.reload(), 100);
        } else {
            document.cookie = `googtrans=/es/${lang};path=/;domain=${cookieDomain};`;
            setTimeout(() => window.location.reload(), 100);
        }
    };

    return (
        <header className="flex items-center justify-between bg-gray-100 px-6 py-4 border-b h-[65px] max-h-[65px]">
            <Breadcrumb />
            <div className="flex items-center gap-4">
                <div id="google_translate_element" style={{ display: 'none' }}></div>
                <button onClick={() => changeLanguage('es')} className="cursor-pointer">
                    <img src="https://flagcdn.com/co.svg" alt="Colombia" className="w-5 h-5 rounded-full object-cover" />
                </button>
                <button onClick={() => changeLanguage('en')} className="cursor-pointer">
                    <img src="https://flagcdn.com/us.svg" alt="USA" className="w-5 h-5 rounded-full object-cover" />
                </button>
                <Link to="/logout" className="text-sm text-gray-700 hover:underline">Cerrar sesión</Link>
            </div>
        </header>
    );
}