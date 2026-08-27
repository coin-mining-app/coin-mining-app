import { requestFcmToken, onForegroundMessage } from './firebase';

class NotificationService {
  // درخواست مجوز اعلان‌های مرورگر
  async requestPermission() {
    if (!('Notification' in window)) return false;

    const result = await Notification.requestPermission();
    return result === 'granted';
  }

  // راه‌اندازی اعلان‌های پوش (در صورت پشتیبانی مرورگر)
  async setupPush() {
    try {
      const token = await requestFcmToken();

      if (!token) {
        console.log('⚠️ FCM token دریافت نشد یا مرورگر پشتیبانی نمی‌کند');
        return;
      }

      console.log('🔐 FCM token:', token);

      // پیام‌های Foreground
      onForegroundMessage((payload) => {
        console.log('📨 پیام جدید:', payload);

        if (payload?.notification?.title) {
          new Notification(payload.notification.title, {
            body: payload.notification.body || '',
            icon: payload.notification.icon || '',
          });
        }
      });
    } catch (error) {
      console.error('❌ خطا در راه‌اندازی اعلان‌ها:', error);
    }
  }

  // اعلان ساده مرورگر
  showBrowserNotification(title, body = '') {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
}

export const notificationService = new NotificationService();
