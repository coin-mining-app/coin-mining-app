import React, { useState, useEffect } from 'react';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// کامپوننت‌های ادمین
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

function AdminApp() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  });

  const handleAdminLogin = (status) => {
    setIsAdminLoggedIn(status);
    if (!status) {
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminUsername');
    }
  };

  if (!isAdminLoggedIn) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
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
      <AdminPanel onLogout={() => handleAdminLogin(false)} />
    </div>
  );
}

export default AdminApp;