import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 📢 انواع اعلان‌ها
export const showNotification = {
  // ✅ موفقیت
  success: (message, options = {}) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // ❌ خطا
  error: (message, options = {}) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // ⚠️ هشدار
  warning: (message, options = {}) => {
    toast.warning(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // ℹ️ اطلاع‌رسانی
  info: (message, options = {}) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // 💰 اعلان پرداخت
  payment: (amount, currency = 'TON') => {
    toast.success(`💰 پرداخت ${amount} ${currency} با موفقیت انجام شد!`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      icon: '💳'
    });
  },

  // 🎁 اعلان پاداش
  reward: (amount, currency = 'TON') => {
    toast.success(`🎁 ${amount} ${currency} پاداش دریافت کردید!`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      icon: '🎉'
    });
  },

  // 🎯 اعلان ماموریت
  mission: (day, reward) => {
    toast.success(`📅 ماموریت روز ${day} انجام شد! +${reward} TON`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      icon: '✅'
    });
  },

  // 🔗 اعلان دعوت
  referral: (username) => {
    toast.success(`👥 کاربر ${username} با لینک شما ثبت‌نام کرد! +1 TON`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      icon: '🔗'
    });
  },

  // 👑 اعلان VIP
  vipUpgrade: (level) => {
    toast.success(`👑 به سطح VIP ${level} ارتقا پیدا کردید!`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      icon: '💎'
    });
  }
};

// 📢 اعلان‌های سیستمی (برای مرورگر)
export const sendBrowserNotification = (title, body, icon = '/logo192.png') => {
  if (!('Notification' in window)) {
    console.log('مرورگر از اعلان پشتیبانی نمیکند');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: icon,
      requireInteraction: true,
      silent: false,
      vibrate: [200, 100, 200]
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, {
          body: body,
          icon: icon,
          requireInteraction: true,
          silent: false,
          vibrate: [200, 100, 200]
        });
      }
    });
  }
};

// 📢 درخواست مجوز اعلان
export const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
};