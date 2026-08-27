import { showNotification } from '../utils/notification';

class NotificationService {
  constructor() {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    this.permission = Notification.permission;
    this.registration = null;
    this.subscription = null;
  }

  // 📢 درخواست مجوز
  async requestPermission() {
    if (!this.isSupported) {
      console.warn('⚠️ اعلان‌ها پشتیبانی نمیشوند');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      if (permission === 'granted') {
        console.log('✅ مجوز اعلان دریافت شد');
        this.registerServiceWorker();
        return true;
      } else {
        console.warn('❌ مجوز اعلان رد شد');
        return false;
      }
    } catch (error) {
      console.error('❌ خطا در درخواست مجوز:', error);
      return false;
    }
  }

  // 🔧 ثبت Service Worker
  async registerServiceWorker() {
    try {
      if ('serviceWorker' in navigator) {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker ثبت شد');
        this.subscribeToPush();
      }
    } catch (error) {
      console.error('❌ خطا در ثبت Service Worker:', error);
    }
  }

  // 📡 اشتراک در اعلان‌ها
  async subscribeToPush() {
    try {
      if (!this.registration) return;
      
      const publicKey = 'BEl62iUYgUvxIxLgVZ6yVlQYs5GgI8YwZxVnQmXpPn';
      
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey
      });
      
      console.log('✅ اشتراک اعلان فعال شد');
      
      // ذخیره در سرور
      await this.saveSubscription(this.subscription);
      
      return this.subscription;
    } catch (error) {
      console.error('❌ خطا در اشتراک اعلان:', error);
    }
  }

  // 💾 ذخیره اشتراک در سرور
  async saveSubscription(subscription) {
    try {
      // ذخیره در localStorage
      localStorage.setItem('pushSubscription', JSON.stringify(subscription));
      
      // در Firebase ذخیره کن
      const { dbService } = await import('./firebase');
      await dbService.setDocument('subscriptions', subscription.endpoint, {
        endpoint: subscription.endpoint,
        keys: subscription.toJSON().keys,
        createdAt: new Date().toISOString()
      });
      
      console.log('✅ اشتراک ذخیره شد');
    } catch (error) {
      console.error('❌ خطا در ذخیره اشتراک:', error);
    }
  }

  // 📤 ارسال اعلان
  async sendNotification(title, body, options = {}) {
    // اگر اعلان بومی پشتیبانی میشه
    if (this.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/logo192.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        ...options
      });
    }

    // همچنین Toast notification
    showNotification.success(`${title}: ${body}`);

    // ذخیره در تاریخچه اعلان‌ها
    this.saveNotificationHistory({ title, body, ...options });
  }

  // 💾 ذخیره تاریخچه اعلان‌ها
  saveNotificationHistory(notification) {
    try {
      const history = JSON.parse(localStorage.getItem('notificationHistory') || '[]');
      history.push({
        ...notification,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('notificationHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving notification history:', error);
    }
  }

  // 📋 دریافت تاریخچه اعلان‌ها
  getNotificationHistory() {
    try {
      return JSON.parse(localStorage.getItem('notificationHistory') || '[]');
    } catch {
      return [];
    }
  }

  // 🗑️ پاک کردن تاریخچه
  clearNotificationHistory() {
    localStorage.removeItem('notificationHistory');
  }

  // 🎯 اعلان‌های ویژه
  sendPaymentNotification(amount, currency = 'TON') {
    this.sendNotification(
      '💰 پرداخت موفق',
      `پرداخت ${amount} ${currency} با موفقیت انجام شد!`
    );
  }

  sendRewardNotification(amount, currency = 'TON') {
    this.sendNotification(
      '🎁 پاداش دریافت شد',
      `${amount} ${currency} به موجودی شما اضافه شد!`
    );
  }

  sendMissionNotification(day, reward) {
    this.sendNotification(
      '📅 ماموریت روزانه',
      `ماموریت روز ${day} انجام شد! +${reward} TON`
    );
  }

  sendVipNotification(level) {
    this.sendNotification(
      '👑 ارتقا VIP',
      `به سطح VIP ${level} ارتقا پیدا کردید!`
    );
  }

  sendReferralNotification(username) {
    this.sendNotification(
      '👥 دعوت جدید',
      `${username} با لینک شما ثبت‌نام کرد!`
    );
  }

  sendWelcomeNotification(username) {
    this.sendNotification(
      '🎉 خوش آمدید',
      `${username} عزیز، به Coin Mining خوش آمدید!`
    );
  }
}

// ایجاد نمونه واحد
export const notificationService = new NotificationService();