import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// تنظیمات Firebase از فایل .env خوانده می‌شود
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// راه‌اندازی Firebase
const app = initializeApp(firebaseConfig);

// سرویس‌ها
export const db = getFirestore(app);
export const auth = getAuth(app);

// Messaging ممکن است روی برخی مرورگرها کار نکند
let messaging;
try {
  messaging = getMessaging(app);
} catch (e) {
  messaging = null;
}

// درخواست توکن FCM
export const requestFcmToken = async () => {
  if (!messaging) return null;

  try {
    const token = await getToken(messaging, {
      vapidKey: 'YOUR_VAPID_KEY_HERE', // اگر خواستی پوش نوتیفیکیشن واقعی داشته باشی
    });
    return token;
  } catch (error) {
    console.error('FCM token error:', error);
    return null;
  }
};

// پیام‌های Foreground
export const onForegroundMessage = (callback) => {
  if (!messaging) return;
  onMessage(messaging, callback);
};
