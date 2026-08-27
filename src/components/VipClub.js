import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/paymentService';
import { showNotification } from '../utils/notification';

const VIP_LEVELS = [
  { id: 'starter', name: 'Starter', cost: 0, multiplier: 1, priority: 4, bonus: 0, emoji: '🥉' },
  { id: 'starter_plus', name: 'Starter Plus', cost: 5, multiplier: 1.2, priority: 3, bonus: 10, emoji: '🥈' },
  { id: 'galaxy', name: 'Galaxy', cost: 10, multiplier: 1.5, priority: 2, bonus: 15, emoji: '🥇' },
  { id: 'nova', name: 'Nova', cost: 20, multiplier: 2, priority: 1, bonus: 20, emoji: '🌟' }
];

function VipClub({ currentLevel, onUpgrade }) {
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const checkWallet = () => {
      const connected = paymentService.isConnected();
      setWalletConnected(connected);
      if (connected) {
        setBalance(paymentService.getBalance());
      }
    };
    
    checkWallet();
    const interval = setInterval(checkWallet, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpgrade = async (level, index) => {
    if (level.cost === 0) {
      showNotification.info('✅ این سطح رایگان است و برای همه باز است!');
      if (currentLevel === 0) {
        onUpgrade(1);
      }
      return;
    }

    if (!walletConnected) {
      showNotification.warning('❌ لطفاً ابتدا کیف پول خود را از بخش "کیف پول" متصل کنید');
      return;
    }

    if (balance < level.cost) {
      showNotification.error(`❌ موجودی کافی نیست. موجودی: ${balance.toFixed(2)} TON - نیاز: ${level.cost} TON`);
      return;
    }

    if (!window.confirm(
      `💰 ارتقا به سطح "${level.name}"\n\n` +
      `هزینه: ${level.cost} TON\n` +
      `ضریب ماینینگ: ${level.multiplier}x\n` +
      `پاداش مأموریت‌ها: ${level.bonus}%\n` +
      `اولویت تسویه: ${level.priority}\n\n` +
      `آیا مطمئن هستید؟`
    )) {
      return;
    }

    setLoading(true);

    try {
      const result = await paymentService.payToAdmin(
        level.cost,
        `ارتقا به VIP ${level.name}`
      );

      if (result) {
        onUpgrade(index + 1);
        setBalance(paymentService.getBalance());
        showNotification.vipUpgrade(level.name);
        showNotification.payment(level.cost);
      }
    } catch (error) {
      showNotification.error('❌ خطا در پرداخت:\n' + error.message);
    }

    setLoading(false);
  };

  const currentVip = VIP_LEVELS[currentLevel - 1] || VIP_LEVELS[0];

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <h3 className="font-bold text-white text-xl mb-4 flex items-center">
        <span className="text-[#FF6B35] mr-2">👑</span> باشگاه VIP
      </h3>
      
      <div className="bg-gradient-to-r from-[#FF6B35]/20 to-orange-500/20 rounded-2xl p-6 text-center mb-6 border border-[#FF6B35]/20">
        <p className="text-sm text-gray-400">سطح فعلی</p>
        <p className="text-3xl font-bold text-[#FF6B35]">{currentVip.emoji} {currentVip.name}</p>
        <div className="flex justify-center gap-4 mt-2 text-sm text-white">
          <span>⚡ {currentVip.multiplier}x</span>
          <span>🎯 اولویت {currentVip.priority}</span>
          <span>🎁 {currentVip.bonus}% پاداش</span>
        </div>
        <div className="mt-3 flex justify-center gap-4 text-xs">
          <span className={walletConnected ? 'text-green-400' : 'text-gray-400'}>
            {walletConnected ? '✅ کیف پول متصل' : '🔗 کیف پول متصل نیست'}
          </span>
          {walletConnected && (
            <span className="text-[#FF6B35]">💰 {balance.toFixed(2)} TON</span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {VIP_LEVELS.map((level, index) => {
          const isCurrent = index + 1 === currentLevel;
          const isLocked = index + 1 > currentLevel + 1 && currentLevel > 0;
          const isUpgradeable = index + 1 === currentLevel + 1 || (index === 0 && currentLevel === 0);
          const isProcessing = loading;
          
          return (
            <div key={level.id} className={`p-4 rounded-2xl border-2 transition-all ${
              isCurrent ? 'border-[#FF6B35] bg-[#FF6B35]/10 shadow-lg shadow-[#FF6B35]/20' : 
              isLocked ? 'border-white/10 opacity-50' : 
              'border-white/20 hover:border-[#FF6B35] hover:bg-white/5'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{level.emoji}</span>
                    <span className="font-bold text-white">{level.name}</span>
                    {isCurrent && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">فعال</span>}
                  </div>
                  <div className="flex gap-3 text-xs text-gray-400 mt-1">
                    <span>⚡ {level.multiplier}x</span>
                    <span>🎯 اولویت {level.priority}</span>
                    <span>🎁 {level.bonus}%</span>
                  </div>
                  {level.cost > 0 && (
                    <div className="text-xs text-[#FF6B35] mt-1">💰 هزینه: {level.cost} TON</div>
                  )}
                </div>
                {!isCurrent && !isLocked && (
                  <button 
                    onClick={() => handleUpgrade(level, index)} 
                    disabled={isProcessing}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      level.cost === 0 
                        ? 'bg-green-500 text-white hover:scale-105' 
                        : 'bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white hover:scale-105'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isProcessing ? '⏳ در حال پرداخت...' : level.cost === 0 ? 'فعال‌سازی' : `ارتقا ${level.cost} TON`}
                  </button>
                )}
                {isLocked && <span className="text-gray-500 text-sm">🔒 قفل</span>}
                {isCurrent && <span className="text-green-500 text-sm">✅</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
        <p className="text-xs text-gray-400 text-center">
          💡 هر ارتقا یک پرداخت واقعی ثبت می‌شود
        </p>
        <p className="text-xs text-gray-500 text-center mt-1">
          🔒 پرداخت‌ها از کیف پول TON شما انجام میشود
        </p>
      </div>
    </div>
  );
}

export default VipClub;