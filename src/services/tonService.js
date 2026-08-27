import { TonConnect } from '@tonconnect/sdk';

// 🔒 آدرس کیف پول شما (فقط برای پرداخت‌ها - هرگز نمایش داده نشود)
const ADMIN_WALLET = 'UQCP4kR905Frt-W0HWjqZn4t2vvpz4t3uFYKI0b9JkUPZajI';

class TonService {
  constructor() {
    this.connector = new TonConnect({
      manifestUrl: 'https://coin-mining-app.vercel.app/tonconnect-manifest.json'
    });
    this.wallet = null;
  }

  // 🔗 اتصال کیف پول کاربر (هدایت به Tonkeeper)
  async connect() {
    try {
      // دریافت لیست کیف پول‌های موجود
      const wallets = await this.connector.getWallets();
      
      // پیدا کردن Tonkeeper
      const tonkeeper = wallets.find(w => 
        w.name.toLowerCase().includes('tonkeeper') || 
        w.appName?.toLowerCase().includes('tonkeeper')
      );
      
      if (tonkeeper) {
        // اتصال مستقیم به Tonkeeper
        this.wallet = await this.connector.connect({
          items: [
            {
              name: 'ton_proof',
              payload: `proof-payload-${Date.now()}`
            }
          ]
        }, tonkeeper);
      } else {
        // اگر Tonkeeper پیدا نشد، لیست کیف پول‌ها را نمایش بده
        this.wallet = await this.connector.connect({
          items: [
            {
              name: 'ton_proof',
              payload: `proof-payload-${Date.now()}`
            }
          ]
        });
      }
      
      return this.wallet;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw new Error('خطا در اتصال کیف پول');
    }
  }

  // ❌ قطع اتصال
  async disconnect() {
    await this.connector.disconnect();
    this.wallet = null;
  }

  // 📍 دریافت آدرس کیف پول کاربر (برای نمایش)
  getUserAddress() {
    return this.connector.wallet?.account?.address || null;
  }

  // 🔍 بررسی وضعیت اتصال
  isConnected() {
    return this.connector.connected;
  }

  // 💰 ارسال پرداخت به کیف پول ادمین (پنهان)
  async sendPaymentToAdmin(amount, comment = '') {
    if (!this.isConnected()) {
      throw new Error('لطفاً ابتدا کیف پول خود را متصل کنید');
    }

    const transaction = {
      valid_until: Math.floor(Date.now() / 1000) + 300,
      messages: [
        {
          address: ADMIN_WALLET, // 🔒 پنهان
          amount: Math.round(amount * 1e9).toString(),
          payload: comment || `پرداخت Coin Mining`
        }
      ]
    };

    try {
      const result = await this.connector.sendTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new Error('خطا در انجام تراکنش');
    }
  }

  // 💳 دریافت موجودی کیف پول کاربر
  async getUserBalance(address) {
    try {
      const response = await fetch(
        `https://toncenter.com/api/v2/getAddressBalance?address=${address}`
      );
      const data = await response.json();
      return data.result / 1e9;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  }

  // 📜 دریافت تاریخچه تراکنش‌های کاربر
  async getUserTransactions(address) {
    try {
      const response = await fetch(
        `https://toncenter.com/api/v2/getTransactions?address=${address}&limit=20`
      );
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  // 👂 تنظیم listener برای تغییرات
  onStatusChange(callback) {
    this.connector.onStatusChange((wallet) => {
      if (callback) callback(wallet);
    });
  }
}

export const tonService = new TonService();