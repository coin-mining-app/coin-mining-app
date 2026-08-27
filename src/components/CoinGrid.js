import React from 'react';

function CoinGrid({ coins, onSelect }) {
  // فیلتر کردن ارزهایی که قیمت دارند
  const validCoins = coins.filter(c => c.price > 0);

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* عنوان بخش */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">💎 انتخاب ارز برای استخراج</h2>
          <p className="text-sm text-gray-500 mt-1">روی هر ارز کلیک کنید تا جزئیات را ببینید</p>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {validCoins.length} ارز
        </span>
      </div>

      {/* گرید ۳×۳ */}
      <div className="grid grid-cols-3 gap-4">
        {validCoins.map((coin) => (
          <div
            key={coin.id}
            onClick={() => onSelect(coin)}
            className="glass-card group cursor-pointer text-center relative overflow-hidden"
          >
            {/* نشانگر زنده */}
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-green-600 font-medium text-[10px] hidden sm:inline">زنده</span>
              </span>
            </div>

            {/* آیکون بزرگ */}
            <div className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              {coin.icon}
            </div>

            {/* نام و نماد */}
            <div className="font-bold text-gray-800 text-lg">{coin.symbol}</div>
            <div className="text-xs text-gray-400">{coin.name}</div>

            {/* قیمت */}
            <div className="mt-3 font-bold text-blue-600 text-base">
              ${coin.price.toFixed(coin.price < 1 ? 4 : 2)}
            </div>

            {/* تغییرات */}
            <div className={`text-xs font-medium mt-1 ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}%
            </div>

            {/* خط پایین با رنگ ارز */}
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: coin.color }}></div>

            {/* هور اثر روی hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoinGrid;