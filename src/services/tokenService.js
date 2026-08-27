import { AUTH_CONFIG } from '../config/auth';

class TokenService {
  constructor() {
    this.secret = AUTH_CONFIG.secret;
    this.tokens = {};
  }

  // 🔑 ایجاد توکن
  generateToken(userId, payload = {}) {
    const token = {
      id: this.generateId(),
      userId: userId,
      payload: payload,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // ۷ روز
    };
    
    // امضای توکن (ساده)
    token.signature = this.signToken(token);
    this.tokens[token.id] = token;
    
    return token;
  }

  // ✅ بررسی توکن
  verifyToken(tokenId) {
    const token = this.tokens[tokenId];
    if (!token) {
      return { valid: false, error: 'توکن یافت نشد' };
    }
    
    if (new Date(token.expiresAt) < new Date()) {
      return { valid: false, error: 'توکن منقضی شده است' };
    }
    
    const signature = this.signToken(token);
    if (signature !== token.signature) {
      return { valid: false, error: 'امضای توکن نامعتبر است' };
    }
    
    return { valid: true, data: token };
  }

  // 🗑️ حذف توکن
  revokeToken(tokenId) {
    delete this.tokens[tokenId];
    return { success: true };
  }

  // 🔑 امضای توکن
  signToken(token) {
    const data = `${token.id}-${token.userId}-${token.createdAt}-${this.secret}`;
    return btoa(encodeURIComponent(data));
  }

  // 🆔 تولید شناسه یکتا
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  }

  // 📊 دریافت اطلاعات توکن از localStorage
  getStoredToken() {
    try {
      const data = localStorage.getItem('auth_token');
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch {
      return null;
    }
  }

  // 💾 ذخیره توکن در localStorage
  storeToken(token) {
    localStorage.setItem('auth_token', JSON.stringify(token));
  }

  // 🗑️ حذف توکن از localStorage
  clearToken() {
    localStorage.removeItem('auth_token');
  }

  // 🔄 بررسی اعتبار توکن ذخیره شده
  validateStoredToken() {
    const token = this.getStoredToken();
    if (!token) {
      return { valid: false, error: 'توکنی وجود ندارد' };
    }
    return this.verifyToken(token.id);
  }
}

export const tokenService = new TokenService();