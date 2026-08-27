// 🔒 آدرس کیف پول شما (پنهان)
const ADMIN_WALLET = 'UQCP4kR905Frt-W0HWjqZn4t2vvpz4t3uFYKI0b9JkUPZajI';

class RealTonService {
  constructor() {
    this.connected = false;
    this.walletAddress = null;
    this.balance = 0;
    this.transactions = [];
  }

  // 🔗 اتصال کیف پول کاربر
  async connect() {
    try {
      // اینجا کد اتصال واقعی قرار میگیره
      // برای حالا شبیه‌سازی میکنیم
      this.connected = true;
      this.walletAddress = 'EQD' + Math.random().toString(36).substring(2, 15);
      this.balance = 10 + Math.random() * 50;
      
      return {
        account: {
          address: this.walletAddress
        }
      };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw new Error('خطا در اتصال کیف پول');
    }
  }

  // ❌ قطع اتصال
  async disconnect() {
    this.connected = false;
    this.walletAddress = null;
    this.balance = 0;
    this.transactions = [];
  }

  // 📍 دریافت آدرس کیف پول کاربر
  getUserAddress() {
    return this.walletAddress;
  }

  // 🔍 بررسی وضعیت اتصال
  isConnected() {
    return this.connected;
  }

  // 💰 ارسال پرداخت واقعی به کیف پول ادمین
  async sendPaymentToAdmin(amount, comment = '') {
    if (!this.isConnected()) {
      throw new Error('لطفاً ابتدا کیف پول خود را متصل کنید');
    }

    if (!amount || amount <= 0) {
      throw new Error('مبلغ معتبر وارد کنید');
    }

    if (amount > this.balance) {
      throw new Error(`موجودی کافی نیست. موجودی: ${this.balance.toFixed(4)} TON`);
    }

    // اینجا کد ارسال تراکنش واقعی قرار میگیره
    // برای حالا شبیه‌سازی میکنیم
    this.balance -= amount;
    this.transactions.unshift({
      utime: Math.floor(Date.now() / 1000),
      in_msg: {
        source: this.walletAddress,
        value: Math.round(amount * 1e9).toString()
      }
    });

    // ذخیره در localStorage برای نمایش
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    payments.push({
      amount,
      address: ADMIN_WALLET,
      date: new Date().toISOString()
    });
    localStorage.setItem('payments', JSON.stringify(payments));

    return { success: true, amount, comment };
  }

  // 💳 دریافت موجودی کیف پول کاربر
  async getUserBalance(address) {
    if (!address) return 0;
    return this.balance;
  }

  // 📜 دریافت تاریخچه تراکنش‌های کاربر
  async getUserTransactions(address) {
    if (!address) return [];
    return this.transactions;
  }

  // 👂 تنظیم listener برای تغییرات
  onStatusChange(callback) {
    if (callback) {
      setTimeout(() => {
        if (this.connected) {
          callback({
            account: {
              address: this.walletAddress
            }
          });
        }
      }, 100);
    }
  }
}

export const realTonService = new RealTonService();