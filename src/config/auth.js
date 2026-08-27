// 🔑 تنظیمات احراز هویت
export const AUTH_CONFIG = {
  // کلید مخفی برای امضای توکن‌ها
  secret: process.env.BETTER_AUTH_SECRET || 'default-secret-key-do-not-use-in-production',
  
  // تنظیمات توکن
  token: {
    expiresIn: '7d', // ۷ روز
    refreshExpiresIn: '30d' // ۳۰ روز
  },
  
  // تنظیمات امنیتی
  security: {
    bcryptRounds: 10,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // ۱۵ دقیقه
      max: 100 // حداکثر ۱۰۰ درخواست
    }
  },
  
  // تنظیمات نشست (Session)
  session: {
    cookieName: 'auth_session',
    maxAge: 7 * 24 * 60 * 60 * 1000 // ۷ روز
  }
};

// 🔑 تولید کلید مخفی (فقط برای توسعه)
export const generateSecret = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
};

// 📝 بررسی وجود کلید مخفی
export const validateAuthConfig = () => {
  if (!process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET === 'your-super-secret-key-here-123456789') {
    console.warn('⚠️ BETTER_AUTH_SECRET is using default value! Please set a secure secret in .env file');
    return false;
  }
  console.log('✅ BETTER_AUTH_SECRET is configured');
  return true;
};