import { encryptUserData, decryptUserData, generateToken, hashPassword, verifyPassword } from '../utils/encryption';

// 👤 کلاس مدیریت احراز هویت
class AuthService {
  constructor() {
    this.currentUser = null;
    this.loadSession();
  }

  // 🔐 بارگذاری نشست
  loadSession() {
    try {
      const session = localStorage.getItem('auth_session');
      if (session) {
        const decrypted = decryptUserData(session);
        if (decrypted) {
          this.currentUser = decrypted;
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  }

  // 🚪 ذخیره نشست
  saveSession() {
    try {
      const encrypted = encryptUserData(this.currentUser);
      localStorage.setItem('auth_session', encrypted);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  // 🔑 ثبت‌نام کاربر جدید
  async register(username, password, email) {
    try {
      // بررسی وجود کاربر
      const users = this.getAllUsers();
      if (users.find(u => u.username === username)) {
        throw new Error('نام کاربری قبلاً ثبت شده است');
      }

      // هش کردن رمز عبور
      const hashedPassword = await hashPassword(password);

      // ایجاد کاربر جدید
      const newUser = {
        id: generateToken(16),
        username,
        email,
        password: hashedPassword,
        level: 1,
        vipLevel: 0,
        balance: 0,
        referrals: [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isAdmin: false
      };

      // ذخیره کاربر
      users.push(newUser);
      this.saveUsers(users);

      // ورود خودکار
      this.currentUser = { ...newUser };
      delete this.currentUser.password;
      this.saveSession();

      return { success: true, user: this.currentUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🔑 ورود کاربر
  async login(username, password) {
    try {
      const users = this.getAllUsers();
      const user = users.find(u => u.username === username);
      
      if (!user) {
        throw new Error('نام کاربری یا رمز عبور اشتباه است');
      }

      // بررسی رمز عبور
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        throw new Error('نام کاربری یا رمز عبور اشتباه است');
      }

      // به‌روزرسانی تاریخ آخرین ورود
      user.lastLogin = new Date().toISOString();
      this.saveUsers(users);

      // ذخیره نشست
      this.currentUser = { ...user };
      delete this.currentUser.password;
      this.saveSession();

      return { success: true, user: this.currentUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🚪 خروج کاربر
  logout() {
    this.currentUser = null;
    localStorage.removeItem('auth_session');
  }

  // 🔍 دریافت کاربر فعلی
  getCurrentUser() {
    return this.currentUser;
  }

  // ✅ بررسی احراز هویت
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // 📝 دریافت همه کاربران
  getAllUsers() {
    try {
      const data = localStorage.getItem('users_data');
      if (data) {
        const decrypted = decryptUserData(data);
        return decrypted || [];
      }
      return [];
    } catch {
      return [];
    }
  }

  // 💾 ذخیره کاربران
  saveUsers(users) {
    try {
      const encrypted = encryptUserData(users);
      localStorage.setItem('users_data', encrypted);
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  // 👤 به‌روزرسانی کاربر
  updateUser(userData) {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === userData.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      this.saveUsers(users);
      if (this.currentUser && this.currentUser.id === userData.id) {
        this.currentUser = { ...users[index] };
        delete this.currentUser.password;
        this.saveSession();
      }
      return true;
    }
    return false;
  }

  // 🔒 تغییر رمز عبور
  async changePassword(userId, oldPassword, newPassword) {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      return { success: false, error: 'کاربر یافت نشد' };
    }

    const isValid = await verifyPassword(oldPassword, user.password);
    if (!isValid) {
      return { success: false, error: 'رمز عبور فعلی اشتباه است' };
    }

    user.password = await hashPassword(newPassword);
    this.saveUsers(users);
    return { success: true };
  }

  // 🔑 تنظیم کاربر به عنوان ادمین (فقط برای توسعه)
  setAdmin(username) {
    const users = this.getAllUsers();
    const user = users.find(u => u.username === username);
    if (user) {
      user.isAdmin = true;
      this.saveUsers(users);
      if (this.currentUser && this.currentUser.id === user.id) {
        this.currentUser.isAdmin = true;
        this.saveSession();
      }
      return true;
    }
    return false;
  }
}

export const authService = new AuthService();