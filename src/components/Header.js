import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function Header({ currentPage, onNavigate, simBalance, userLevel, vipLevel, isUserLoggedIn, username }) {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'home', icon: '🏠', label: t('home') },
    { id: 'wallet', icon: '💳', label: t('wallet') },
    { id: 'missions', icon: '📋', label: t('missions') },
    { id: 'profile', icon: '👤', label: t('profile') },
    { id: 'vip', icon: '💎', label: t('vip') },
    { id: 'referral', icon: '👥', label: t('referral') },
    { id: 'about', icon: 'ℹ️', label: t('about') },
    { id: 'support', icon: '🎫', label: t('support') },
    { id: 'settings', icon: '⚙️', label: t('settings') }
  ];

  if (isUserLoggedIn) {
    menuItems.splice(6, 0, { id: 'userpanel', icon: '👤', label: t('user_panel') });
  }

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-blue-100/50 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center justify-between p-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-2xl font-bold text-blue-600">⛏️</span>
          <span className="font-bold text-gray-800 text-lg">Coin Mining</span>
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`p-2 rounded-xl transition-all text-sm whitespace-nowrap ${
                currentPage === item.id
                  ? 'bg-blue-500/10 text-blue-600 font-medium'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="hidden sm:inline ml-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between px-3 pb-2 text-xs text-gray-500 max-w-7xl mx-auto">
        <div className="flex gap-4">
          <span>{t('level')}: <span className="font-bold text-gray-700">{userLevel}</span></span>
          <span>VIP: <span className="font-bold text-blue-600">{vipLevel}</span></span>
        </div>
        <div className="flex gap-4">
          {isUserLoggedIn && <span className="text-green-600 font-medium">👤 {username}</span>}
          <span className="font-bold text-blue-600">{simBalance.toFixed(2)} TON</span>
        </div>
      </div>
    </header>
  );
}

export default Header;