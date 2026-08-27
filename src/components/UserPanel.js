import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { paymentService } from '../services/paymentService';

function UserPanel({ onLogout }) {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setEmail(currentUser.email || '');
      setBalance(paymentService.getBalance());
      setTransactions(paymentService.getTransactions());
      
      const refs = JSON.parse(localStorage.getItem('referrals') || '[]');
      const userRefs = refs.filter(r => r.inviter === currentUser.username);
      setReferrals(userRefs);
    }
  }, []);

  const handleUpdateProfile = () => {
    if (user) {
      const updated = { ...user, email };
      authService.updateUser(updated);
      setUser(updated);
      alert('✅ پروفایل با موفقیت به‌روزرسانی شد!');
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    if (!oldPassword || !newPassword) {
      alert('❌ لطفاً هر دو فیلد رمز عبور را پر کنید');
      return;
    }
    if (newPassword.length < 4) {
      alert('❌ رمز عبور جدید باید حداقل ۴ کاراکتر باشد');
      return;
    }

    const result = await authService.changePassword(user.id, oldPassword, newPassword);
    if (result.success) {
      alert('✅ رمز عبور با موفقیت تغییر کرد!');
      setOldPassword('');
      setNewPassword('');
    } else {
      alert('❌ ' + result.error);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="glass-card text-center">
              <div className="text-3xl mb-2">👤</div>
              <div className="text-lg font-bold text-blue-600">{user?.username}</div>
              <div className="text-sm text-gray-500">نام کاربری</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-lg font-bold text-green-600">{balance.toFixed(2)} TON</div>
              <div className="text-sm text-gray-500">موجودی</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-lg font-bold text-purple-600">سطح {user?.level || 1}</div>
              <div className="text-sm text-gray-500">سطح کاربری</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl mb-2">💎</div>
              <div className="text-lg font-bold text-yellow-600">VIP {user?.vipLevel || 0}</div>
              <div className="text-sm text-gray-500">سطح VIP</div>
            </div>
            <div className="glass-card text-center col-span-2 md:col-span-1">
              <div className="text-3xl mb-2">🔗</div>
              <div className="text-lg font-bold text-orange-600">{referrals.length}</div>
              <div className="text-sm text-gray-500">تعداد دعوت‌ها</div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="glass-card">
            <h3 className="font-bold text-gray-800 mb-4">👤 ویرایش پروفایل</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
                <input
                  type="text"
                  value={user?.username || ''}
                  disabled
                  className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیل خود را وارد کنید"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleUpdateProfile}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold hover:scale-105 transition-all"
              >
                💾 ذخیره تغییرات
              </button>
            </div>
          </div>
        );

      case 'password':
        return (
          <div className="glass-card">
            <h3 className="font-bold text-gray-800 mb-4">🔒 تغییر رمز عبور</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور فعلی</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="رمز عبور فعلی را وارد کنید"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور جدید</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="رمز عبور جدید را وارد کنید"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleChangePassword}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:scale-105 transition-all"
              >
                🔑 تغییر رمز عبور
              </button>
            </div>
          </div>
        );

      case 'transactions':
        return (
          <div className="glass-card">
            <h3 className="font-bold text-gray-800 mb-4">💰 تاریخچه تراکنش‌ها</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right p-3 text-gray-600">#</th>
                    <th className="text-right p-3 text-gray-600">نوع</th>
                    <th className="text-right p-3 text-gray-600">مبلغ</th>
                    <th className="text-right p-3 text-gray-600">تاریخ</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr><td colSpan="4" className="text-center p-4 text-gray-400">هیچ تراکنشی ثبت نشده</td></tr>
                  ) : (
                    transactions.map((tx, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="p-3 text-gray-600">{index + 1}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${tx.type === 'پرداخت' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-gray-800">{tx.amount} TON</td>
                        <td className="p-3 text-gray-500">{tx.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'referrals':
        return (
          <div className="glass-card">
            <h3 className="font-bold text-gray-800 mb-4">🔗 لیست دعوت‌ها</h3>
            <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">لینک دعوت شما:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`https://t.me/Mining_crypto_coin_bot?start=${user?.id}`}
                  readOnly
                  className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://t.me/Mining_crypto_coin_bot?start=${user?.id}`);
                    alert('✅ لینک کپی شد!');
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  📋 کپی
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right p-3 text-gray-600">#</th>
                    <th className="text-right p-3 text-gray-600">کاربر دعوت‌شده</th>
                    <th className="text-right p-3 text-gray-600">پاداش</th>
                    <th className="text-right p-3 text-gray-600">تاریخ</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.length === 0 ? (
                    <tr><td colSpan="4" className="text-center p-4 text-gray-400">هیچ دعوتی ثبت نشده</td></tr>
                  ) : (
                    referrals.map((ref, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="p-3 text-gray-600">{index + 1}</td>
                        <td className="p-3 text-gray-800">{ref.invited || 'نامشخص'}</td>
                        <td className="p-3 text-green-600 font-bold">+{ref.reward || 1} TON</td>
                        <td className="p-3 text-gray-500">{ref.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">👤 پنل کاربری</h1>
            <p className="text-sm text-gray-500">خوش آمدید {user?.username} 👋</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
          >
            🚪 خروج
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 داشبورد
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            👤 پروفایل
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'password' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            🔒 رمز عبور
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'transactions' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            💰 تراکنش‌ها
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'referrals' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            🔗 دعوت‌ها
          </button>
        </div>

        {renderTab()}
      </div>
    </div>
  );
}

export default UserPanel;