import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { tokenService } from '../services/tokenService';

const WalletConnect = () => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState(null);
  const [wallet, setWallet] = useState(null);

  // وضعیت اتصال کیف پول
  useEffect(() => {
    if (tokenService.isConnected()) {
      setWallet(tokenService.getWallet());
    }
  }, []);

  // اتصال کیف پول
  const handleConnect = async () => {
    try {
      await tokenService.connector.connect();
      setWallet(tokenService.getWallet());
      setStatus('کیف پول با موفقیت متصل شد');
    } catch (error) {
      setStatus('خطا در اتصال کیف پول');
    }
  };

  // قطع اتصال
  const handleDisconnect = async () => {
    await tokenService.disconnect();
    setWallet(null);
    setStatus('اتصال کیف پول قطع شد');
  };

  // پرداخت واقعی TON
  const handlePay = async () => {
    try {
      const value = Number(amount);
      if (!value || value <= 0) {
        setStatus('مبلغ نامعتبر است');
        return;
      }

      await tokenService.sendTonPayment(value);

      setStatus(`پرداخت ${value} TON با موفقیت انجام شد`);
      setAmount('');
    } catch (error) {
      setStatus(error.message || 'خطا در پرداخت');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-3">
      <div className="glass-card space-y-2">
        <h2 className="text-sm font-bold">{t('wallet_title')}</h2>

        {!wallet ? (
          <button onClick={handleConnect} className="btn-blue w-full">
            {t('connect_wallet')}
          </button>
        ) : (
          <div className="space-y-2 text-xs">
            <p className="text-gray-500">{t('your_address')}</p>
            <p className="font-mono text-[11px] break-all">
              {wallet.address}
            </p>

            <button
              onClick={handleDisconnect}
              className="btn-outline-blue w-full mt-2"
            >
              {t('disconnect')}
            </button>
          </div>
        )}
      </div>

      <div className="glass-card space-y-2 text-xs">
        <h3 className="font-semibold">{t('payment')}</h3>

        <label className="block text-[11px] text-gray-500 mb-1">
          {t('amount')}
        </label>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs"
          placeholder="0.5"
        />

        <button onClick={handlePay} className="btn-blue w-full mt-2">
          {t('pay')}
        </button>

        {status && (
          <p className="text-[11px] text-blue-600 mt-1">{status}</p>
        )}
      </div>
    </div>
  );
};

export default WalletConnect;
