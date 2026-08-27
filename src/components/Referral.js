import React, { useState, useEffect } from 'react';

function Referral() {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [totalReferrals, setTotalReferrals] = useState(0);

  useEffect(() => {
    const userId = 'USER_' + Math.random().toString(36).substring(2, 8);
    setReferralCode(`https://t.me/Mining_crypto_coin_bot?start=${userId}`);
    const saved = JSON.parse(localStorage.getItem('referrals') || '[]');
    setReferrals(saved);
    setTotalReferrals(saved.length);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(referralCode);
    alert('✅ لینک کپی شد!');
  };

  const shareOnTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralCode)}&text=🎉 به Coin Mining بپیوندید و درآمد داشته باشید!`);
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <h3 className="font-bold text-white text-xl mb-4 flex items-center">
        <span className="text-[#FF6B35] mr-2">👥</span> زیرمجموعه‌گیری
      </h3>
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 text-center mb-6 border border-blue-500/20">
        <p className="text-lg font-bold text-white">با معرفی به هر یک از دوستانت ۱ TON جایزه بگیر</p>
        <p className="text-sm text-gray-400 mt-1">و ۱۰٪ از واریزهای دوستانت را شریک شو</p>
      </div>
      <div className="bg-white/5 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2">
          <input type="text" value={referralCode} readOnly className="flex-1 p-2 bg-white/10 rounded-xl text-white text-sm font-mono" />
          <button onClick={copyLink} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">📋</button>
        </div>
      </div>
      <div className="flex gap-3 mb-6">
        <button onClick={shareOnTelegram} className="flex-1 py-3 bg-[#0088cc] text-white rounded-xl font-bold hover:scale-105 transition-all">📨 تلگرام</button>
        <button className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:scale-105 transition-all">💬 واتساپ</button>
        <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:scale-105 transition-all">📱 اینستاگرام</button>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium text-white">دوستان دعوت شده</p>
          <span className="bg-[#FF6B35] text-white px-3 py-1 rounded-full text-sm">{totalReferrals} نفر</span>
        </div>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {referrals.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">هنوز کسی دعوت نشده است</p>
          ) : (
            referrals.map((ref, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FF6B35]/20 flex items-center justify-center">👤</div>
                  <div><p className="font-medium text-white">@{ref.username}</p><p className="text-xs text-gray-400">{ref.joined}</p></div>
                </div>
                <div className="text-green-500 font-bold">+{ref.earned} TON</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Referral;