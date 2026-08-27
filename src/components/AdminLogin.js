import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function AdminLogin({ onLogin }) {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = '123456';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminUsername', username);
      setLoading(false);
      onLogin(true);
    } else {
      setError(t('invalid_credentials'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛠️</div>
          <h1 className="text-2xl font-bold text-gray-800">{t('admin_login')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('admin_only')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('username_label')}</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t('enter_username')} className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required autoFocus />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('password_label')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('enter_password')} className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
          </div>
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center border border-red-200">{error}</div>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50">
            {loading ? '⏳ ' + t('checking') : '🔑 ' + t('login')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;