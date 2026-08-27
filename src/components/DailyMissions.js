import React, { useState, useEffect } from 'react';
import { showNotification } from '../utils/notification';

function DailyMissions() {
  const [missions, setMissions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [lastClaim, setLastClaim] = useState(null);
  const [currentCycle, setCurrentCycle] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('dailyMissions');
    if (saved) {
      const data = JSON.parse(saved);
      setStreak(data.streak || 0);
      setLastClaim(data.lastClaim ? new Date(data.lastClaim) : null);
      setCurrentCycle(data.cycle || 1);
    }
    generateMissions();
  }, []);

  const generateMissions = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      days.push({ day: i, reward: i, claimed: false });
    }
    setMissions(days);
  };

  const claimReward = (day) => {
    const now = new Date();
    
    if (lastClaim) {
      const hoursDiff = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
      if (hoursDiff < 24) {
        showNotification.warning('⏳ هنوز ۲۴ ساعت کامل نشده است!');
        return;
      }
    }

    const expectedDay = (streak % 7) + 1;
    if (day !== expectedDay) {
      showNotification.warning('⚠️ لطفاً روزهای زنجیره را به ترتیب دریافت کنید!');
      return;
    }

    const newStreak = streak + 1;
    const newCycle = Math.floor(newStreak / 7) + 1;
    
    setStreak(newStreak);
    setCurrentCycle(newCycle);
    setLastClaim(now);
    
    localStorage.setItem('dailyMissions', JSON.stringify({ 
      streak: newStreak, 
      lastClaim: now,
      cycle: newCycle 
    }));
    
    setMissions(missions.map(m => m.day === day ? { ...m, claimed: true } : m));
    
    const reward = day;
    showNotification.mission(day, reward);
    showNotification.reward(reward);
    
    if (newStreak % 7 === 0) {
      setTimeout(() => {
        setMissions(missions.map(m => ({ ...m, claimed: false })));
        showNotification.info('🔄 چرخه جدید مأموریت‌ها شروع شد!');
      }, 500);
    }
  };

  useEffect(() => {
    if (lastClaim) {
      const now = new Date();
      const hoursDiff = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
      if (hoursDiff > 48) {
        setStreak(0);
        setCurrentCycle(1);
        localStorage.setItem('dailyMissions', JSON.stringify({ streak: 0, lastClaim: null, cycle: 1 }));
        setMissions(missions.map(m => ({ ...m, claimed: false })));
        showNotification.warning('⏰ زنجیره شما به دلیل عدم فعالیت ریست شد!');
      }
    }
  }, [lastClaim]);

  return (
    <div className="glass-card">
      <h3 className="font-bold text-gray-800 text-xl mb-4 flex items-center">
        <span className="text-blue-600 mr-2">📅</span> مأموریت‌های روزانه
      </h3>
      
      <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl p-4 mb-4 text-center border border-blue-200/50">
        <p className="text-sm text-gray-500">زنجیره فعلی</p>
        <p className="text-4xl font-bold text-blue-600">🔥 {streak}</p>
        <p className="text-xs text-gray-400">روز متوالی | چرخه {currentCycle}</p>
        <p className="text-xs text-green-600 mt-1">روز بعد: {((streak % 7) + 1)} TON</p>
      </div>

      <div className="space-y-3">
        {missions.map((mission) => {
          const isAvailable = ((streak % 7) + 1) === mission.day;
          const isDisabled = mission.claimed || !isAvailable;
          
          return (
            <div key={mission.day} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
              mission.claimed ? 'bg-green-50/50 border border-green-200/50' :
              isAvailable ? 'bg-blue-50/50 border border-blue-200/50 animate-pulse' :
              'bg-gray-50/50 opacity-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  mission.claimed ? 'bg-green-500 text-white' :
                  isAvailable ? 'bg-blue-600 text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {mission.day}
                </div>
                <div>
                  <p className="font-medium text-gray-800">روز {mission.day}</p>
                  <p className="text-sm text-gray-500">{mission.reward} TON جایزه</p>
                  {isAvailable && !mission.claimed && (
                    <p className="text-xs text-blue-600">✅ قابل دریافت</p>
                  )}
                </div>
              </div>
              {!mission.claimed && isAvailable ? (
                <button onClick={() => claimReward(mission.day)} className="btn-blue text-sm px-4 py-2">
                  دریافت 🎁
                </button>
              ) : mission.claimed ? (
                <span className="text-green-600 font-bold text-sm">✅ دریافت شد</span>
              ) : (
                <span className="text-gray-400 text-sm">🔒 قفل</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyMissions;