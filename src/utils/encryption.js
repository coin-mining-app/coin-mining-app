import CryptoJS from 'crypto-js';

// 🔑 کلید رمزنگاری (در محیط واقعی باید در متغیر محیطی ذخیره شود)
const SECRET_KEY = 'coin-mining-secret-key-2026';

// 📝 رمزنگاری متن
export const encrypt = (text) => {
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

// 🔓 رمزگشایی متن
export const decrypt = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// 🔒 رمزنگاری داده‌های حساس کاربر
export const encryptUserData = (data) => {
  const jsonString = JSON.stringify(data);
  return encrypt(jsonString);
};

// 🔓 رمزگشایی داده‌های حساس کاربر
export const decryptUserData = (encryptedData) => {
  const decrypted = decrypt(encryptedData);
  if (!decrypted) return null;
  try {
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
};

// 🔑 تولید توکن تصادفی
export const generateToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// 🛡️ هش کردن رمز عبور با bcrypt (شبیه‌سازی)
export const hashPassword = async (password) => {
  // در محیط واقعی از bcrypt استفاده کنید
  // اینجا یک شبیه‌سازی ساده است
  return CryptoJS.SHA256(password + SECRET_KEY).toString();
};

// ✅ بررسی رمز عبور
export const verifyPassword = async (password, hashedPassword) => {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
};