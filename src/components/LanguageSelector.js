import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const languages = [
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

function LanguageSelector({ onSelect }) {
  const [selected, setSelected] = useState('fa');
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">⛏️</div>
          <h1 className="text-3xl font-bold text-gray-800">{t('appName')}</h1>
          <p className="text-gray-500 mt-1">{t('choose_language')}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setSelected(lang.code);
                onSelect(lang.code);
              }}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                selected === lang.code
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <span className="text-3xl block">{lang.flag}</span>
              <span className="font-medium text-gray-800 text-sm mt-1 block">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LanguageSelector;