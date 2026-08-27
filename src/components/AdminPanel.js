import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { paymentService } from '../services/paymentService';
import { authService } from '../services/authService';
import AdvancedStats from './AdvancedStats';

function AdminPanel({ onLogout }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    totalReferrals: 0,
    totalFeedbacks: 0,
    vipUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
    totalTickets: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    const transactionsData = paymentService.getTransactions();
    const referralsData = JSON.parse(localStorage.getItem('referrals') || '[]');
    const feedbacksData = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    
    setUsers(usersData);
    setTransactions(transactionsData);
    setReferrals(referralsData);
    setFeedbacks(feedbacksData);
    
    const totalRevenue = transactionsData
      .filter(t => t.type === 'پرداخت')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const vipUsers = usersData.filter(u => u.vipLevel > 0).length;
    const today = new Date().toDateString();
    const newUsersToday = usersData.filter(u => new Date(u.createdAt).toDateString() === today).length;
    const activeUsers = usersData.filter(u => {
      const lastLogin = new Date(u.lastLogin || u.createdAt);
      return (new Date() - lastLogin) < 7 * 24 * 60 * 60 * 1000;
    }).length;

    setStats({
      totalUsers: usersData.length,
      totalTransactions: transactionsData.length,
      totalRevenue: totalRevenue,
      totalReferrals: referralsData.length,
      totalFeedbacks: feedbacksData.length,
      vipUsers: vipUsers,
      newUsersToday: newUsersToday,
      activeUsers: activeUsers,
      totalTickets: 5
    });
  };

  const deleteUser = (userId) => {
    if (window.confirm('آیا از حذف این کاربر مطمئن هستید؟')) {
      const updated = users.filter(u => u.id !== userId);
      setUsers(updated);
      localStorage.setItem('users', JSON.stringify(updated));
      loadData();
    }
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(t => 
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'dashboard', label: '📊 داشبورد', icon: '📊' },
    { id: 'users', label: '👥 کاربران', icon: '👥' },
    { id: 'transactions', label: '💰 تراکنش‌ها', icon: '💰' },
    { id: 'referrals', label: '🔗 دعوت‌ها', icon: '🔗' },
    { id: 'feedbacks', label: '💬 بازخوردها', icon: '💬' },
    { id: 'analytics', label: '📈 آمار پیشرفته', icon: '📈' },
    { id: 'settings', label: '⚙️ تنظیمات', icon: '⚙️' }
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* کارت‌های آمار */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card text-center hover:shadow-xl transition-all">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                <div className="text-sm text-gray-500">کاربران کل</div>
                <div className="text-xs text-green-500">جدید: {stats.newUsersToday}</div>
              </div>
              <div className="glass-card text-center hover:shadow-xl transition-all">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold text-green-600">{stats.totalRevenue.toFixed(2)} TON</div>
                <div className="text-sm text-gray-500">درآمد کل</div>
                <div className="text-xs text-blue-500">تراکنش: {stats.totalTransactions}</div>
              </div>
              <div className="glass-card text-center hover:shadow-xl transition-all">
                <div className="text-3xl mb-2">💎</div>
                <div className="text-2xl font-bold text-yellow-600">{stats.vipUsers}</div>
                <div className="text-sm text-gray-500">کاربران VIP</div>
                <div className="text-xs text-purple-500">فعال: {stats.activeUsers}</div>
              </div>
              <div className="glass-card text-center hover:shadow-xl transition-all">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-orange-600">{stats.totalReferrals}</div>
                <div className="text-sm text-gray-500">دعوت‌ها</div>
                <div className="text-xs text-pink-500">بازخورد: {stats.totalFeedbacks}</div>
              </div>
            </div>

            {/* دکمه‌های سریع */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={() => setActiveTab('users')} className="p-4 bg-blue-50 rounded-xl text-blue-600 hover:bg-blue-100 transition-all text-sm font-medium">
                👥 مدیریت کاربران
              </button>
              <button onClick={() => setActiveTab('transactions')} className="p-4 bg-green-50 rounded-xl text-green-600 hover:bg-green-100 transition-all text-sm font-medium">
                💰 مدیریت تراکنش‌ها
              </button>
              <button onClick={() => setActiveTab('analytics')} className="p-4 bg-purple-50 rounded-xl text-purple-600 hover:bg-purple-100 transition-all text-sm font-medium">
                📈 مشاهده آمار
              </button>
              <button onClick={() => setActiveTab('feedbacks')} className="p-4 bg-orange-50 rounded-xl text-orange-600 hover:bg-orange-100 transition-all text-sm font-medium">
                💬 بازخوردها
              </button>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="glass-card">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="font-bold text-gray-800">👥 مدیریت کاربران</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{filteredUsers.length} کاربر</span>
                <input
                  type="text"
                  placeholder="جستجوی کاربر..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                />
                <button 
                  onClick={() => {
                    if (window.confirm('آیا از پاک کردن همه کاربران مطمئن هستید؟')) {
                      localStorage.setItem('users', '[]');
                      loadData();
                    }
                  }}
                  className="px-3 py-1 bg-red-50 text-red-500 rounded-lg text-sm hover:bg-red-100 transition-colors"
                >
                  🗑️ همه
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right p-3 text-gray-600">#</th>
                    <th className="text-right p-3 text-gray-600">نام کاربری</th>
                    <th className="text-right p-3 text-gray-600">سطح</th>
                    <th className="text-right p-3 text-gray-600">VIP</th>
                    <th className="text-right p-3 text-gray-600">موجودی</th>
                    <th className="text-right p-3 text-gray-600">تاریخ ثبت</th>
                    <th className="text-right p-3 text-gray-600">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan="7" className="text-center p-4 text-gray-400">هیچ کاربری یافت نشد</td></tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                        <td className="p-3 text-gray-600">{index + 1}</td>
                        <td className="p-3 font-medium text-gray-800">{user.username || 'کاربر'}</td>
                        <td className="p-3"><span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">Level {user.level || 1}</span></td>
                        <td className="p-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">VIP {user.vip || 0}</span></td>
                        <td className="p-3 font-bold text-gray-800">{user.balance?.toFixed(2) || 0} TON</td>
                        <td className="p-3 text-gray-500">{new Date(user.createdAt).toLocaleDateString('fa-IR')}</td>
                        <td className="p-3">
                          <button 
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100 transition-colors mr-1"
                          >
                            👁️
                          </button>
                          <button 
                            onClick={() => deleteUser(user.id)}
                            className="px-2 py-1 bg-red-50 text-red-500 rounded-lg text-xs hover:bg-red-100 transition-colors"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'analytics':
        return <AdvancedStats />;

      case 'settings':
        return (
          <div className="glass-card">
            <h3 className="font-bold text-gray-800 mb-4">⚙️ تنظیمات مدیریت</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">آدرس کیف پول ادمین</p>
                  <p className="text-sm text-gray-500 font-mono break-all">UQCP4kR905Frt-W0HWjqZn4t2vvpz4t3uFYKI0b9JkUPZajI</p>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('UQCP4kR905Frt-W0HWjqZn4t2vvpz4t3uFYKI0b9JkUPZajI');
                    alert('✅ کپی شد!');
                  }}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                >
                  کپی
                </button>
              </div>
              <button 
                onClick={() => {
                  if (window.confirm('⚠️ آیا از پاک کردن همه داده‌ها مطمئن هستید؟')) {
                    localStorage.clear();
                    alert('✅ همه داده‌ها پاک شد!');
                    loadData();
                  }
                }}
                className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-colors"
              >
                🗑️ پاک کردن همه داده‌ها
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // مودال نمایش کاربر
  const UserModal = () => {
    if (!showUserModal || !selectedUser) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">👤 جزئیات کاربر</h3>
            <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <div className="space-y-3">
            <div><span className="text-sm text-gray-500">نام کاربری:</span> <span className="font-medium">{selectedUser.username}</span></div>
            <div><span className="text-sm text-gray-500">ایمیل:</span> <span className="font-medium">{selectedUser.email || 'ثبت نشده'}</span></div>
            <div><span className="text-sm text-gray-500">سطح:</span> <span className="font-medium">{selectedUser.level || 1}</span></div>
            <div><span className="text-sm text-gray-500">VIP:</span> <span className="font-medium">{selectedUser.vip || 0}</span></div>
            <div><span className="text-sm text-gray-500">موجودی:</span> <span className="font-medium text-blue-600">{selectedUser.balance?.toFixed(2) || 0} TON</span></div>
            <div><span className="text-sm text-gray-500">تاریخ ثبت:</span> <span className="font-medium">{new Date(selectedUser.createdAt).toLocaleString('fa-IR')}</span></div>
            <div><span className="text-sm text-gray-500">آخرین ورود:</span> <span className="font-medium">{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString('fa-IR') : 'نامشخص'}</span></div>
          </div>
          <button onClick={() => setShowUserModal(false)} className="mt-4 w-full py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
            بستن
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🛠️ پنل مدیریت پیشرفته</h1>
            <p className="text-sm text-gray-500">خوش آمدید {localStorage.getItem('adminUsername')} 👋</p>
          </div>
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
          >
            🚪 خروج
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {renderTab()}
        <UserModal />
      </div>
    </div>
  );
}

export default AdminPanel;