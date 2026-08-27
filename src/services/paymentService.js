// 🔒 آدرس کیف پول شما (پنهان)
const ADMIN_WALLET = 'UQCP4kR905Frt-W0HWjqZn4t2vvpz4t3uFYKI0b9JkUPZajI';

class PaymentService {
  constructor() {
    this.walletConnected = false;
    this.walletAddress = null;
    this.balance = 25.5;
    this.transactions = [];
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('paymentData');
      if (saved) {
        const data = JSON.parse(saved);
        this.walletConnected = data.walletConnected || false;
        this.walletAddress = data.walletAddress || null;
        this.balance = data.balance || 25.5;
        this.transactions = data.transactions || [];
      }
    } catch (error) {
      console.error('Error loading payment data:', error);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('paymentData', JSON.stringify({
        walletConnected: this.walletConnected,
        walletAddress: this.walletAddress,
        balance: this.balance,
        transactions: this.transactions
      }));
    } catch (error) {
      console.error('Error saving payment data:', error);
    }
  }

  connectWallet() {
    this.walletConnected = true;
    this.walletAddress = 'EQ' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 10);
    this.saveToStorage();
    return { address: this.walletAddress };
  }

  disconnectWallet() {
    this.walletConnected = false;
    this.walletAddress = null;
    this.saveToStorage();
  }

  getAddress() {
    return this.walletAddress;
  }

  isConnected() {
    return this.walletConnected;
  }

  getBalance() {
    return this.balance;
  }

  async payToAdmin(amount, description = '') {
    return new Promise((resolve, reject) => {
      if (!this.isConnected()) {
        reject(new Error('لطفاً ابتدا کیف پول خود را متصل کنید'));
        return;
      }
      if (amount > this.balance) {
        reject(new Error(`موجودی کافی نیست. موجودی: ${this.balance.toFixed(2)} TON`));
        return;
      }

      setTimeout(() => {
        this.balance -= amount;
        const transaction = {
          id: Date.now(),
          type: 'پرداخت',
          amount: amount,
          description: description || 'پرداخت درون برنامه‌ای',
          date: new Date().toLocaleString('fa-IR'),
          status: 'موفق',
          to: ADMIN_WALLET
        };
        this.transactions.unshift(transaction);
        this.saveToStorage();
        resolve(transaction);
      }, 1000);
    });
  }

  getTransactions() {
    return this.transactions;
  }
}

export const paymentService = new PaymentService();