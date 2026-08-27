const ADMIN_WALLET = 'UQCP4kR905Frt-W0HWjqZn4t2vvpz4t3uFYKI0b9JkUPZajI';

class PaymentService {
  constructor() {
    this.walletConnected = false;
    this.walletAddress = null;
    this.balance = 25.5; // موجودی اولیه شبیه‌سازی‌شده
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
      localStorage.setItem(
        'paymentData',
        JSON.stringify({
          walletConnected: this.walletConnected,
          walletAddress: this.walletAddress,
          balance: this.balance,
          transactions: this.transactions,
        })
      );
    } catch (error) {
      console.error('Error saving payment data:', error);
    }
  }

  connectWallet() {
    this.walletConnected = true;
    this.walletAddress =
      'EQ' +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 10);

    this.saveToStorage();
    return { address: this.walletAddress };
  }

  disconnectWallet() {
    this.walletConnected = false;
    this.walletAddress = null;
    this.saveToStorage();
  }

  isConnected() {
    return this.walletConnected;
  }

  getAddress() {
    return this.walletAddress;
  }

  getBalance() {
    return this.balance;
  }

  pay(amount, description = 'In-app payment') {
    if (amount <= 0) {
      return { success: false, message: 'مبلغ نامعتبر است' };
    }

    if (amount > this.balance) {
      return { success: false, message: 'موجودی کافی نیست' };
    }

    this.balance -= amount;

    const tx = {
      id: 'TX-' + Date.now(),
      amount,
      to: ADMIN_WALLET,
      description,
      createdAt: new Date().toISOString(),
    };

    this.transactions.unshift(tx);
    this.saveToStorage();

    return { success: true, tx };
  }

  getTransactions() {
    return this.transactions;
  }
}

export const paymentService = new PaymentService();
export const ADMIN_WALLET_ADDRESS = ADMIN_WALLET;
