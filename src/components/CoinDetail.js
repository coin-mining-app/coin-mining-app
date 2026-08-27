import React, { useState, useEffect } from 'react';

function CoinDetail({ coin, onBack, onBalanceUpdate }) {
  const [freeMinerActive, setFreeMinerActive] = useState(false);
  const [rentedMiners, setRentedMiners] = useState([
    { id: 1, name: 'ماینر پایه', power: '۰.۵ واحد', dailyProfit: '۰.۵', price: 1, active: false, endDate: null },
    { id: 2, name: 'ماینر متوسط', power: '۱ واحد', dailyProfit: '۱', price: 2, active: false, endDate: null },
    { id: 3, name: 'ماینر پیشرفته', power: '۲ واحد', dailyProfit: '۲', price: 4, active: false, endDate: null },
    { id: 4, name: 'ماینر حرفه‌ای', power: '۴ واحد', dailyProfit: '۴', price: 8, active: false, endDate: null }
  ]);
  const [balance, setBalance] = useState(0);
  const [minedAmount, setMinedAmount] = useState(0);
  const [boostActive, setBoostActive] = useState(false);
  const [boostTimer, setBoostTimer] = useState(0);

  // شبیه‌سازی ماینینگ رایگان
  useEffect(() => {
    let interval;
    if (freeMinerActive) {
      interval = setInterval(() => {
        const amount = coin.miningPower * (boostActive ? 2 : 1) / 3600;
        setMinedAmount(prev => prev + amount);
        setBalance(prev => prev + amount);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [freeMinerActive, coin.miningPower, boostActive]);

  // شبیه‌سازی ماینرهای اجاره‌ای
  useEffect(() => {
    const interval = setInterval(() => {
      rentedMiners.forEach((miner, index) => {
        if (miner.active) {
          const profit = parseFloat(miner.dailyProfit) / 86400;
          setBalance(prev => prev + profit);
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [rentedMiners]);

  const startFreeMining = () => setFreeMinerActive(true);
  const stopFreeMining = () => setFreeMinerActive(false);

  const rentMiner = (index) => {
    const miner = rentedMiners[index];
    if (miner.active) {
      alert('⛔ این ماینر قبلاً اجاره شده است!');
      return;
    }
    if (!window.confirm(`آیا ماینر "${miner.name}" را با ${miner.price} TON اجاره میکنید؟`)) return;
    
    const updated = [...rentedMiners];
    updated[index].active = true;
    updated[index].endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    setRentedMiners(updated);
    alert(`✅ ماینر "${miner.name}" با موفقیت اجاره شد! (۳۰ روز فعال)`);
  };

  const activateBoost = () => {
    if (!boostActive && freeMinerActive) {
      setBoostActive(true);
      setBoostTimer(30 * 60);
      const timer = setInterval(() => {
        setBoostTimer(prev => {
          if (prev <= 1) { clearInterval(timer); setBoostActive(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleClaim = () => {
    if (balance === 0) {
      alert('⛔ موجودی برای برداشت وجود ندارد!');
      return;
    }
    onBalanceUpdate(balance);
    setBalance(0);
    setMinedAmount(0);
    alert(`✅ ${balance.toFixed(4)} ${coin.symbol} به موجودی شما اضافه شد!`);
  };

  const handleConvertToTon = (amount) => {
    if (amount <= 0 || amount > balance) {
      alert('⛔ مقدار نامعتبر!');
      return;
    }
    const tonAmount = amount / coin.price;
    setBalance(prev => prev - amount);
    alert(`✅ ${amount} ${coin.symbol} به ${tonAmount.toFixed(4)} TON تبدیل شد!`);
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] p-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all">
          ←
        </button>
        <div className="flex items-center gap-3">
          <div className="text-5xl">{coin.icon}</div>
          <div>
            <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
            <p className="text-gray-400 text-sm">{coin.symbol}</p>
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-sm text-gray-400">قیمت</div>
          <div className="font-bold text-[#FF6B35]">${coin.price.toFixed(2)}</div>
        </div>
      </div>

      {/* Balance */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-orange-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <p className="text-sm opacity-80">موجودی {coin.symbol}</p>
        <p className="text-4xl font-bold">{balance.toFixed(4)}</p>
        <p className="text-sm opacity-80 mt-1">≈ ${(balance * coin.price).toFixed(2)}</p>
        <button onClick={handleClaim} className="mt-3 px-4 py-2 bg-white/20 rounded-xl text-sm font-bold hover:bg-white/30 transition-all">
          برداشت موجودی 💰
        </button>
      </div>

      {/* Free Miner */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-4">
        <h3 className="font-bold text-white text-lg mb-3 flex items-center">
          ⚡ ماینر رایگان
          {freeMinerActive && <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full animate-pulse">فعال</span>}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">قدرت ماینینگ</p>
            <p className="text-2xl font-bold text-[#FF6B35]">{coin.miningPower * (boostActive ? 2 : 1)} {coin.symbol}/ساعت</p>
            {boostActive && <p className="text-xs text-orange-500">🔥 تقویت فعال: {formatTime(boostTimer)}</p>}
          </div>
          {!freeMinerActive ? (
            <button onClick={startFreeMining} className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white rounded-2xl font-bold hover:scale-105 transition-all">
              شروع ▶
            </button>
          ) : (
            <button onClick={stopFreeMining} className="px-6 py-3 bg-red-500 text-white rounded-2xl font-bold hover:scale-105 transition-all">
              توقف ⏹
            </button>
          )}
        </div>
        {freeMinerActive && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>در حال ماینینگ...</span>
              <span>{minedAmount.toFixed(4)} {coin.symbol}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-[#FF6B35] to-orange-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min((minedAmount / 0.01) * 100, 100)}%` }}></div>
            </div>
          </div>
        )}
        {freeMinerActive && !boostActive && (
          <button onClick={activateBoost} className="mt-3 w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-bold hover:scale-105 transition-all text-sm">
            🔥 فعال‌سازی سرعت دو برابر (۳۰ دقیقه)
          </button>
        )}
      </div>

      {/* 4 Rented Miners */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-4">
        <h3 className="font-bold text-white text-lg mb-3">🏗️ ماینرهای اجاره‌ای (۴ عدد)</h3>
        <p className="text-xs text-gray-400 mb-3">هر ماینر ۳۰ روز فعالیت می‌کند</p>
        <div className="grid grid-cols-2 gap-3">
          {rentedMiners.map((miner, index) => (
            <div key={index} className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 ${miner.active ? 'border-green-500 bg-green-500/10' : 'border-white/20 hover:border-[#FF6B35] cursor-pointer hover:bg-white/5'}`}>
              <div className="text-3xl mb-1">⛏️</div>
              <div className="font-medium text-white text-sm">{miner.name}</div>
              <div className="text-xs text-gray-400">{miner.power}</div>
              <div className="text-xs text-green-400">سود: {miner.dailyProfit} {coin.symbol}/روز</div>
              {miner.active ? (
                <>
                  <span className="text-xs text-green-500">✅ فعال</span>
                  <div className="text-xs text-gray-500 mt-1">{Math.ceil((miner.endDate - new Date()) / (1000 * 60 * 60 * 24))} روز باقی‌مانده</div>
                </>
              ) : (
                <button onClick={() => rentMiner(index)} className="mt-2 px-3 py-1 bg-[#FF6B35] text-white rounded-xl text-xs font-bold hover:scale-105 transition-all">
                  اجاره {miner.price} TON
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Convert to TON */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-white text-lg mb-3 flex items-center">
          🔄 تبدیل به TON
          <span className="text-xs text-gray-400 ml-auto">نرخ لحظه‌ای: ۱ TON = {(1 / coin.price).toFixed(4)} {coin.symbol}</span>
        </h3>
        <div className="flex gap-3">
          <input type="number" placeholder={`مقدار ${coin.symbol}`} className="flex-1 p-3 bg-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6B35] border border-white/20" step="0.0001" min="0" id="convertInput" />
          <button className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white rounded-xl font-bold hover:scale-105 transition-all" onClick={() => {
            const input = document.getElementById('convertInput');
            const amount = parseFloat(input.value);
            handleConvertToTon(amount);
          }}>
            تبدیل
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">حداقل موجودی قابل تبدیل: ۰.۰۰۰۱ {coin.symbol}</p>
      </div>
    </div>
  );
}

export default CoinDetail;