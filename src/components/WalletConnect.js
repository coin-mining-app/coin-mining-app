import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/paymentService';

function WalletConnect() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    if (paymentService.isConnected()) {
      const addr = paymentService.getAddress();
      setAddress(addr);
      setBalance(paymentService.getBalance());
      setTransactions(paymentService.getTransactions());
    } else {
      setAddress(null);
      setBalance(0);
      setTransactions([]);
    }
  };

  const connectWallet = () => {
    setLoading(true);
    try {
      const result = paymentService.connectWallet();
      if (result && result.address) {
        setAddress(result.address);
        setBalance(paymentService.getBalance());
        alert('✅ کیف پول با موفقیت متصل شد!');
      }
    } catch (error) {
      alert('❌ خطا در اتصال کیف پول:\n' + error.message);
    }
    setLoading(false);
  };

  const disconnectWallet = () => {
    try {
      paymentService.disconnectWallet();
      setAddress(null);
      setBalance(0);
      setTransactions([]);
      alert('🔌 کیف پول قطع شد');
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const handlePayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (!address) {
      alert('❌ لطفاً ابتدا کیف پول خود را متصل کنید');
      return;
    }
    if (!amount || amount <= 0) {
      alert('❌ مبلغ معتبر وارد کنید');
      return;
    }
    if (amount > balance) {
      alert(`❌ موجودی کافی نیست. موجودی: ${balance.toFixed(2)} TON`);
      return;
    }

    setLoading(true);
    try {
      const result = await paymentService.payToAdmin(amount, 'پرداخت درون برنامه‌ای');
      if (result) {
        alert(`✅ پرداخت ${amount} TON با موفقیت انجام شد!`);
        loadData();
        setPaymentAmount('');
      }
    } catch (error) {
      alert('❌ خطا در پرداخت:\n' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="glass-card">
        <h3 className="font-bold text-gray-800 text-xl mb-4 flex items-center">
          <span className="text-blue-600 mr-2">💳</span> کیف پول
        </h3>

        {!address ? (
          <button
            onClick={connectWallet}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? '⏳ در حال اتصال...' : '🔗 اتصال کیف پول TON'}
          </button>
        ) : (
          <>
            <div className="bg-gray-50/80 rounded-xl p-4 mb-4 border border-gray-200/50">
              <p className="text-sm text-gray-500">آدرس کیف پول شما</p>
              <p className="font-mono text-sm text-gray-800 break-all">
                {address.slice(0, 10)}...{address.slice(-10)}
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">موجودی کیف پول</p>
                <p className="text-2xl font-bold text-blue-600">{balance.toFixed(2)} TON</p>
              </div>
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-sm hover:bg-red-100 transition-all border border-red-200/50"
              >
                قطع اتصال
              </button>
            </div>

            <div className="bg-blue-50/50 rounded-xl p-4 mb-4 border border-blue-200/50">
              <p className="text-sm text-gray-600 mb-2">💳 پرداخت درون برنامه‌ای</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="مبلغ به TON"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="flex-1 p-3 bg-white rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                  step="0.1"
                  min="0.1"
                  max={balance}
                />
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? '⏳' : 'پرداخت'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                🔒 پرداخت شما به کیف پول امن برنامه واریز میشود
              </p>
            </div>

            <div className="mt-4">
              <h4 className="font-bold text-gray-800 mb-2">📜 تاریخچه تراکنش‌ها</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {transactions.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">هیچ تراکنشی ثبت نشده است</p>
                ) : (
                  transactions.map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{tx.type}</p>
                        <p className="text-xs text-gray-400">{tx.date}</p>
                      </div>
                      <div className={`font-bold ${tx.type === 'پرداخت' ? 'text-red-500' : 'text-green-500'}`}>
                        {tx.type === 'پرداخت' ? '-' : '+'}{tx.amount} TON
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WalletConnect;