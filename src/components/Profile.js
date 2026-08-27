import React from 'react';

function Profile({ userLevel, vipLevel, simBalance }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <h3 className="font-bold text-white text-xl mb-4 flex items-center">
        <span className="text-[#FF6B35] mr-2">👤</span> پروفایل
      </h3>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF6B35] to-orange-500 flex items-center justify-center text-3xl">
          👤
        </div>
        <div>
          <p className="text-xl font-bold text-white">کاربر عزیز</p>
          <p className="text-sm text-gray-400">@user_{Math.random().toString(36).substring(2, 6)}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-400">سطح</p>
          <p className="text-2xl font-bold text-[#FF6B35]">{userLevel}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-400">VIP</p>
          <p className="text-2xl font-bold text-yellow-500">{vipLevel}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center col-span-2">
          <p className="text-sm text-gray-400">موجودی کل</p>
          <p className="text-2xl font-bold text-[#FF6B35]">{simBalance.toFixed(4)} TON</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;