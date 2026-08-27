import React, { useState, useEffect } from 'react';

function MarketList({ coins }) {
  const [prices, setPrices] = useState(coins);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const updated = coins.map(c => ({
      ...c,
      price: c.price || 0,
      change24h: c.change24h || 0
    }));
    setPrices(updated);
    setLastUpdate(new Date());
  }, [coins]);

  const tonPrice = prices.find(c => c.id === 'ton');

  return (
    <div className="px-4 pb-6 max-w-7xl mx-auto">
      <div className="glass-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center">
            <span className="text-blue-600 mr-2">📊</span> قیمت‌های لحظه‌ای
          </h3>
          <span className="text-xs text-gray-400">
            بروزرسانی: {lastUpdate.toLocaleTimeString('fa-IR')}
          </span>
        </div>

        {/* TON ویژه */}
        {tonPrice && tonPrice.price > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 mb-4 flex items-center justify-between border border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                ⧫
              </div>
              <div>
                <span className="font-bold text-gray-800">TON</span>
                <span className="text-xs text-gray-500 mr-2">Toncoin</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-blue-600">${tonPrice.price.toFixed(4)}</div>
              <div className={`text-xs font-medium ${tonPrice.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {tonPrice.change24h >= 0 ? '▲' : '▼'} {Math.abs(tonPrice.change24h).toFixed(2)}%
              </div>
            </div>
          </div>
        )}

        {/* لیست ارزها */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {prices.map((coin) => {
            if (coin.price === 0) return null;
            return (
              <div key={coin.id} className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer border border-transparent hover:border-blue-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: coin.color }}>
                    {coin.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{coin.symbol}</div>
                    <div className="text-xs text-gray-400">{coin.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">${coin.price.toFixed(coin.price < 1 ? 6 : 2)}</div>
                  <div className={`text-sm font-medium ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MarketList;