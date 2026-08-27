// کلید امنیتی از فایل .env خوانده می‌شود
const SECRET = process.env.BETTER_AUTH_SECRET || 'coin-mining-secret-key-2026';

/**
 * هش‌سازی ساده اما امن‌تر نسبت به نسخه قبلی
 * مناسب برای ذخیره رمز عبور، توکن‌ها و داده‌های حساس
 */
export const simpleHash = (str) => {
  const full = str + SECRET;
  let hash = 0;

  for (let i = 0; i < full.length; i++) {
    hash = (hash << 5) - hash + full.charCodeAt(i);
    hash |= 0; // تبدیل به 32 بیت
  }

  return 'H' + Math.abs(hash);
};

/**
 * رمزگذاری ساده (Base64 + کلید امنیتی)
 */
export const encrypt = (text) => {
  const combined = text + '::' + SECRET;
  return btoa(combined);
};

/**
 * رمزگشایی
 */
export const decrypt = (encoded) => {
  try {
    const decoded = atob(encoded);
    const [text] = decoded.split('::');
    return text;
  } catch (e) {
    return null;
  }
};
