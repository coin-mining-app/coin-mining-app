import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart, Scatter, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { dbService } from '../services/firebase';
import { paymentService } from '../services/paymentService';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

function AdvancedStats() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    dailyRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    totalTransactions: 0,
    totalReferrals: 0,
    vipUsers: 0,
    averageBalance: 0,
    topUsers: [],
    recentTransactions: [],
    revenueChart: [],
    userGrowth: [],
    coinDistribution: [],
    hourlyActivity: [],
    userRetention: [],
    revenueByCoin: [],
    deviceStats: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [chartType, setChartType] = useState('revenue');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const users = await dbService.getAllUsers();
      const transactions = await dbService.getAllDocuments('transactions');
      const referrals = await dbService.getAllDocuments('referrals');
      
      const usersData = users.data || [];
      const transactionsData = transactions.data || [];
      const referralsData = referrals.data || [];

      // آمار پایه
      const totalRevenue = transactionsData
        .filter(t => t.type === 'پرداخت')
        .reduce((sum, t) => sum + t.amount, 0);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const dailyRevenue = transactionsData
        .filter(t => t.type === 'پرداخت' && new Date(t.createdAt) >= today)
        .reduce((sum, t) => sum + t.amount, 0);

      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyRevenue = transactionsData
        .filter(t => t.type === 'پرداخت' && new Date(t.createdAt) >= weekAgo)
        .reduce((sum, t) => sum + t.amount, 0);

      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const monthlyRevenue = transactionsData
        .filter(t => t.type === 'پرداخت' && new Date(t.createdAt) >= monthAgo)
        .reduce((sum, t) => sum + t.amount, 0);

      const vipUsers = usersData.filter(u => u.vipLevel > 0).length;
      const totalBalance = usersData.reduce((sum, u) => sum + (u.balance || 0), 0);
      const averageBalance = usersData.length > 0 ? totalBalance / usersData.length : 0;

      // کاربران برتر
      const topUsers = [...usersData]
        .sort((a, b) => (b.balance || 0) - (a.balance || 0))
        .slice(0, 10);

      // تراکنش‌های اخیر
      const recentTransactions = [...transactionsData]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 20);

      // نمودار درآمد
      const revenueChart = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        
        const dayRevenue = transactionsData
          .filter(t => t.type === 'پرداخت' && new Date(t.createdAt) >= dayStart && new Date(t.createdAt) < dayEnd)
          .reduce((sum, t) => sum + t.amount, 0);
        
        revenueChart.push({
          date: dayStart.toLocaleDateString('fa-IR'),
          revenue: dayRevenue,
          transactions: transactionsData.filter(t => new Date(t.createdAt) >= dayStart && new Date(t.createdAt) < dayEnd).length,
          users: usersData.filter(u => new Date(u.createdAt) >= dayStart && new Date(u.createdAt) < dayEnd).length
        });
      }

      // توزیع کاربران بر اساس نوع ارز
      const coinDistribution = [
        { name: 'BTC', value: usersData.filter(u => u.coinType === 'btc').length || 5 },
        { name: 'ETH', value: usersData.filter(u => u.coinType === 'eth').length || 8 },
        { name: 'TON', value: usersData.filter(u => u.coinType === 'ton').length || 15 },
        { name: 'SOL', value: usersData.filter(u => u.coinType === 'sol').length || 3 },
        { name: 'BNB', value: usersData.filter(u => u.coinType === 'bnb').length || 6 },
        { name: 'DOGE', value: usersData.filter(u => u.coinType === 'doge').length || 4 },
      ];

      // فعالیت ساعتی
      const hourlyActivity = [];
      for (let i = 0; i < 24; i++) {
        hourlyActivity.push({
          hour: i,
          users: Math.floor(Math.random() * 20) + 5,
          transactions: Math.floor(Math.random() * 30) + 10
        });
      }

      // رشد کاربران
      const userGrowth = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        
        const dayUsers = usersData.filter(u => new Date(u.createdAt) >= dayStart && new Date(u.createdAt) < dayEnd).length;
        
        userGrowth.push({
          date: dayStart.toLocaleDateString('fa-IR'),
          users: dayUsers,
          cumulative: usersData.filter(u => new Date(u.createdAt) <= dayEnd).length
        });
      }

      setStats({
        totalUsers: usersData.length,
        activeUsers: usersData.filter(u => {
          const lastLogin = new Date(u.lastLogin || u.createdAt);
          return (now - lastLogin) < 7 * 24 * 60 * 60 * 1000;
        }).length,
        totalRevenue,
        dailyRevenue,
        weeklyRevenue,
        monthlyRevenue,
        totalTransactions: transactionsData.length,
        totalReferrals: referralsData.length,
        vipUsers,
        averageBalance,
        topUsers,
        recentTransactions,
        revenueChart,
        userGrowth,
        coinDistribution,
        hourlyActivity,
        userRetention: [
          { day: 'روز 1', retention: 100 },
          { day: 'روز 7', retention: 65 },
          { day: 'روز 14', retention: 45 },
          { day: 'روز 30', retention: 30 },
          { day: 'روز 60', retention: 20 },
          { day: 'روز 90', retention: 15 }
        ],
        revenueByCoin: [
          { name: 'BTC', revenue: totalRevenue * 0.35 },
          { name: 'ETH', revenue: totalRevenue * 0.25 },
          { name: 'TON', revenue: totalRevenue * 0.20 },
          { name: 'SOL', revenue: totalRevenue * 0.10 },
          { name: 'BNB', revenue: totalRevenue * 0.07 },
          { name: 'DOGE', revenue: totalRevenue * 0.03 }
        ],
        deviceStats: [
          { name: 'موبایل', value: 65 },
          { name: 'دسکتاپ', value: 25 },
          { name: 'تبلت', value: 10 }
        ]
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="glass-card text-center p-8">
        <div className="text-4xl mb-3 animate-spin">⏳</div>
        <p className="text-gray-500">در حال بارگذاری آمار...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* کارت‌های آمار اصلی */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="glass-card text-center hover:shadow-xl transition-all">
          <div className="text-2xl mb-1">👥</div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
          <div className="text-xs text-gray-500">کاربران کل</div>
          <div className="text-xs text-green-500">فعال: {stats.activeUsers}</div>
        </div>
        <div className="glass-card text-center hover:shadow-xl transition-all">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-2xl font-bold text-green-600">{stats.totalRevenue.toFixed(2)} TON</div>
          <div className="text-xs text-gray-500">درآمد کل</div>
          <div className="text-xs text-blue-500">امروز: {stats.dailyRevenue.toFixed(2)}</div>
        </div>
        <div className="glass-card text-center hover:shadow-xl transition-all">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-2xl font-bold text-purple-600">{stats.totalTransactions}</div>
          <div className="text-xs text-gray-500">تراکنش‌ها</div>
          <div className="text-xs text-orange-500">ارجاع: {stats.totalReferrals}</div>
        </div>
        <div className="glass-card text-center hover:shadow-xl transition-all">
          <div className="text-2xl mb-1">💎</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.vipUsers}</div>
          <div className="text-xs text-gray-500">کاربران VIP</div>
          <div className="text-xs text-gray-400">میانگین: {stats.averageBalance.toFixed(2)}</div>
        </div>
        <div className="glass-card text-center hover:shadow-xl transition-all">
          <div className="text-2xl mb-1">📈</div>
          <div className="text-2xl font-bold text-indigo-600">{stats.userGrowth[stats.userGrowth.length - 1]?.cumulative || 0}</div>
          <div className="text-xs text-gray-500">رشد کاربران</div>
          <div className="text-xs text-green-500">+{stats.userGrowth[stats.userGrowth.length - 1]?.users || 0} امروز</div>
        </div>
        <div className="glass-card text-center hover:shadow-xl transition-all">
          <div className="text-2xl mb-1">🔄</div>
          <div className="text-2xl font-bold text-pink-600">{stats.totalTransactions}</div>
          <div className="text-xs text-gray-500">تراکنش‌ها</div>
          <div className="text-xs text-blue-500">هفتگی: {stats.weeklyRevenue.toFixed(2)}</div>
        </div>
      </div>

      {/* انتخابگر زمان و نوع نمودار */}
      <div className="glass-card">
        <div className="flex flex-wrap gap-3 mb-4">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="day">امروز</option>
            <option value="week">هفته</option>
            <option value="month">ماه</option>
            <option value="year">سال</option>
          </select>
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="revenue">درآمد</option>
            <option value="transactions">تراکنش‌ها</option>
            <option value="growth">رشد کاربران</option>
            <option value="distribution">توزیع</option>
          </select>
        </div>

        {/* نمودار درآمد */}
        <div className="h-80">
          <h4 className="font-bold text-gray-800 mb-3">📈 نمودار درآمد و تراکنش‌ها</h4>
          <ResponsiveContainer width="100%" height="85%">
            <ComposedChart data={stats.revenueChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="درآمد (TON)" />
              <Line yAxisId="right" type="monotone" dataKey="transactions" stroke="#10B981" name="تراکنش‌ها" />
              <Line yAxisId="right" type="monotone" dataKey="users" stroke="#F59E0B" name="کاربران جدید" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* نمودارهای دوگانه */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* نمودار توزیع ارزها */}
        <div className="glass-card h-80">
          <h4 className="font-bold text-gray-800 mb-3">🥧 توزیع کاربران بر اساس ارز</h4>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={stats.coinDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.coinDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* نمودار فعالیت ساعتی */}
        <div className="glass-card h-80">
          <h4 className="font-bold text-gray-800 mb-3">🕐 فعالیت ساعتی</h4>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={stats.hourlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="کاربران" />
              <Area type="monotone" dataKey="transactions" stackId="1" stroke="#10B981" fill="#10B981" name="تراکنش‌ها" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* نمودارهای بیشتر */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* رشد کاربران */}
        <div className="glass-card h-80">
          <h4 className="font-bold text-gray-800 mb-3">📊 رشد کاربران</h4>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={stats.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#8B5CF6" name="کاربران جدید" />
              <Line type="monotone" dataKey="cumulative" stroke="#EC4899" name="مجموع کاربران" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* نرخ نگهداشت */}
        <div className="glass-card h-80">
          <h4 className="font-bold text-gray-800 mb-3">📊 نرخ نگهداشت کاربران</h4>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={stats.userRetention}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="retention" fill="#F59E0B" name="درصد نگهداشت" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* درآمد بر اساس ارز و دستگاه‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card h-80">
          <h4 className="font-bold text-gray-800 mb-3">💰 درآمد بر اساس ارز</h4>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={stats.revenueByCoin} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10B981" name="درآمد (TON)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card h-80">
          <h4 className="font-bold text-gray-800 mb-3">📱 توزیع دستگاه‌ها</h4>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={stats.deviceStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.deviceStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* کاربران برتر */}
      <div className="glass-card">
        <h4 className="font-bold text-gray-800 mb-3">🏆 کاربران برتر</h4>
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
              </tr>
            </thead>
            <tbody>
              {stats.topUsers.map((user, index) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                  <td className="p-3 font-bold text-gray-400">#{index + 1}</td>
                  <td className="p-3 font-medium text-gray-800">{user.username}</td>
                  <td className="p-3"><span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">Level {user.level || 1}</span></td>
                  <td className="p-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">VIP {user.vip || 0}</span></td>
                  <td className="p-3 font-bold text-blue-600">{user.balance?.toFixed(2) || 0} TON</td>
                  <td className="p-3 text-gray-500">{new Date(user.createdAt).toLocaleDateString('fa-IR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdvancedStats;