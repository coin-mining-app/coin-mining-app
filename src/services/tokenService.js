import { TonConnect } from '@tonconnect/sdk';
import { WALLET_ADDRESS } from '../types';

const MANIFEST_URL = `${window.location.origin}/tonconnect-manifest.json`;

class TokenService {
  constructor() {
    this.connector = new TonConnect({ manifestUrl: MANIFEST_URL });
  }

  // آیا کیف پول متصل است؟
  isConnected() {
    return this.connector.connected;
  }

  // اتصال کیف پول (از طریق TonConnect UI در کامپوننت)
  async connect() {
    // اتصال واقعی از طریق UI انجام می‌شود (مثلاً در WalletConnect)
    // اینجا فقط وضعیت را برمی‌گردانیم
    return this.connector.connected;
  }

  // قطع اتصال
  async disconnect() {
    await this.connector.disconnect();
  }

  // دریافت اطلاعات کیف پول
  getWallet() {
    return this.connector.account;
  }

  // ساخت تراکنش واقعی برای پرداخت TON به کیف پول ادمین
  async sendTonPayment(amountTon) {
    if (!this.connector.connected) {
      throw new Error('کیف پول متصل نیست');
    }

    if (amountTon <= 0) {
      throw new Error('مبلغ نامعتبر است');
    }

    // مقدار TON به نانو‌تون (1 TON = 10^9 nanoTON)
    const nanoTon = BigInt(Math.floor(amountTon * 1_000_000_000));

    const tx = {
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [
        {
          address: WALLET_ADDRESS,
          amount: nanoTon.toString(),
        },
      ],
    };

    // ارسال تراکنش به کیف پول کاربر
    await this.connector.sendTransaction(tx);

    return {
      success: true,
      to: WALLET_ADDRESS,
      amount: amountTon,
    };
  }
}

export const tokenService = new TokenService();
