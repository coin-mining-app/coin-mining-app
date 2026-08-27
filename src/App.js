import React, { useState, useEffect } from 'react';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// کامپوننت‌ها
import LanguageSelector from './components/LanguageSelector';
import RulesModal from './components/RulesModal';
import Header from './components/Header';
import CoinGrid from './components/CoinGrid';
import MarketList from './components/MarketList';
import CoinDetail from './components/CoinDetail';
import WalletConnect from './components/WalletConnect';
import DailyMissions from './components/DailyMissions';
import Referral from './components/Referral';
import VipClub from './components/VipClub';
import Profile from './components/Profile';
import Settings from './components/Settings';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import SupportTicket from './components/SupportTicket';
import About from './components/About';

// سرویس‌ها
import { getPrices } from './services/priceService';
import { COINS } from './types';
import { authService } from './services/authService';
import { syncService } from './services/syncService';
import { showNotification, requestNotificationPermission } from './utils/notification';
import { useLanguage } from './context/LanguageContext';
import { notificationService } from './services/notificationService';

function App() {
  const { language, changeLanguage, t } = useLanguage();
  
  const [showRules, setShowRules] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [coins, setCoins] = useState(COINS);
  const [userLevel, setUserLevel] = useState(1);
  const [vipLevel, setVipLevel] = useState(0);
  const [simBalance, setSimBalance] = useState(0);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  });
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => {
    return authService.isAuthenticated();
  });

  // درخواست مجوز اعلان
  useEffect(() => {
    requestNotificationPermission();
    
    // راه‌اندازی اعلان‌های پوش
    const setupNotifications = async () => {
      try {
        const granted = await notificationService.requestPermission();
        if (granted) {
          console.log('✅ اعلان‌ها فعال شدند');
        }
      } catch (error) {
        console.log('ℹ️ اعلان‌ها در دسترس نیستند');
      }
    };
    setupNotifications();
  }, []);

  // بارگذاری داده‌ها از localStorage
  useEffect(() => {
    const level = Number(localStorage.getItem('userLevel') || 1);
    const vip = Number(localStorage.getItem('vipLevel') || 0);
    const balance = Number(localStorage.getItem('simTonBalance') || 0);
    setUserLevel(level);
    setVipLevel(vip);
    setSimBalance(balance);
  }, []);

  // لینک مستقیم ادمین (?admin=true)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setCurrentPage('admin');
    }
  }, []);

  // همگام‌سازی با Firebase
  useEffect(() => {
    const syncData = async () => {
      const lastSync = localStorage.getItem('lastSync');
      const now = new Date().getTime();
      const lastSyncTime = lastSync ? new Date(lastSync).getTime() : 0;
      
      if (now - lastSyncTime > 5 * 60 * 1000) {
        const result = await syncService.syncAllData();
        if (result.success) {
          showNotification.success(t('sync_success') || '✅ داده‌ها با سرور همگام‌سازی شد');
        } else {
          showNotification.error(t('sync_error') || '❌ خطا در همگام‌سازی');
        }
      }
    };
    
    syncData();
    const interval = setInterval(syncData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [t]);

  // دریافت قیمت‌ها از API
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getPrices();
        if (data && data.length > 0) {
          setCoins(data);
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };
    
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLanguageSelect = (lang) => {
    changeLanguage(lang);
  };

  const handleAdminLogin = (status) => {
    setIsAdminLoggedIn(status);
    if (!status) {
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminUsername');
    }
  };

  const handleUserLogout = () => {
    authService.logout();
    setIsUserLoggedIn(false);
    setCurrentPage('home');
    showNotification.info(t('logout_success') || '👋 شما از حساب خود خارج شدید');
  };

  // صفحه انتخاب زبان (اگر زبانی انتخاب نشده)
  if (!language) {
    return <LanguageSelector onSelect={handleLanguageSelect} />;
  }

  // صفحه قوانین
  if (showRules) {
    return (
      <RulesModal 
        onAccept={() => setShowRules(false)} 
        onLater={() => setShowRules(false)} 
      />
    );
  }

  // صفحه جزئیات ارز
  if (selectedCoin) {
    return (
      <CoinDetail
        coin={selectedCoin}
        onBack={() => setSelectedCoin(null)}
        onBalanceUpdate={(amount) => {
          const newBalance = simBalance + amount;
          setSimBalance(newBalance);
          localStorage.setItem('simTonBalance', String(newBalance));
        }}
      />
    );
  }

  // رندر صفحات
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <div className="px-4 py-4 max-w-7xl mx-auto">
              <div className="glass-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{t('hello')}</p>
                    <p className="text-xl font-bold text-gray-800">
                      {authService.isAuthenticated() 
                        ? authService.getCurrentUser()?.username || t('dear_user')
                        : t('dear_user')
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{t('total_balance')}</p>
                    <p className="text-xl font-bold text-blue-600">{simBalance.toFixed(4)} TON</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-200/50">{t('level')} {userLevel}</span>
                  <span className="text-xs bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full border border-yellow-200/50">VIP {vipLevel}</span>
                  {authService.isAuthenticated() && (
                    <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-200/50">
                      ✅ {t('logged_in')}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <CoinGrid coins={coins} onSelect={setSelectedCoin} />
            <MarketList coins={coins} />
          </>
        );
      case 'wallet':
        return <WalletConnect />;
      case 'missions':
        return (
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            <DailyMissions />
            <Referral />
          </div>
        );
      case 'profile':
        return (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Profile 
              userLevel={userLevel}
              vipLevel={vipLevel}
              simBalance={simBalance}
            />
          </div>
        );
      case 'vip':
        return (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <VipClub 
              currentLevel={vipLevel}
              onUpgrade={(newLevel) => {
                setVipLevel(newLevel);
                localStorage.setItem('vipLevel', String(newLevel));
                showNotification.vipUpgrade(newLevel);
              }}
            />
          </div>
        );
      case 'referral':
        return (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Referral />
          </div>
        );
      case 'admin':
        if (!isAdminLoggedIn) {
          return <AdminLogin onLogin={handleAdminLogin} />;
        }
        return <AdminPanel onLogout={() => handleAdminLogin(false)} />;
      case 'userpanel':
        return (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <UserPanel onLogout={handleUserLogout} />
          </div>
        );
      case 'support':
        return (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <SupportTicket />
          </div>
        );
      case 'about':
        return (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <About />
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Settings 
              onLanguageChange={() => {
                changeLanguage('fa');
                showNotification.info(t('language_changed') || '🌍 زبان با موفقیت تغییر کرد');
              }}
            />
          </div>
        );
      default:
        return <div className="text-gray-800 p-4">صفحه پیدا نشد</div>;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Header 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        simBalance={simBalance}
        userLevel={userLevel}
        vipLevel={vipLevel}
        isUserLoggedIn={isUserLoggedIn}
        username={authService.getCurrentUser()?.username}
      />
      <main className="pb-20">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;