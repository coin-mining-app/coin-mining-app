import axios from 'axios';

const COINS = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: '#F7931A' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', icon: '⟠', color: '#627EEA' },
  { id: 'trx', symbol: 'TRX', name: 'Tron', icon: '◈', color: '#EF0027' },
  { id: 'ton', symbol: 'TON', name: 'Toncoin', icon: '⧫', color: '#0098EA' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', icon: '◎', color: '#9945FF' },
  { id: 'bnb', symbol: 'BNB', name: 'BNB', icon: '◆', color: '#F3BA2F' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', icon: '₮', color: '#26A17B' },
  { id: 'xrp', symbol: 'XRP', name: 'Ripple', icon: '✕', color: '#00AAE4' },
  { id: 'doge', symbol: 'DOGE', name: 'Dogecoin', icon: 'Ð', color: '#C2A633' }
];

// 🔑 کلید API رایگان CoinGecko (محدودیت 30 درخواست در دقیقه)
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const getPrices = async () => {
  try {
    // 🔥 درخواست به API CoinGecko
    const response = await axios.get(`${COINGECKO_API}/simple/price`, {
      params: {
        ids: 'bitcoin,ethereum,tron,toncoin,solana,binancecoin,tether,ripple,dogecoin',
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_market_cap: true,
        include_24hr_vol: true
      },
      timeout: 10000 // 10 ثانیه تایم‌اوت
    });

    const data = response.data;
    console.log('📊 قیمت‌های دریافت شده از CoinGecko:', data);

    // نقشه شناسه‌ها
    const idMap = {
      bitcoin: 'btc',
      ethereum: 'eth',
      tron: 'trx',
      toncoin: 'ton',   // ✅ TON به درستی مپ شده
      solana: 'sol',
      binancecoin: 'bnb',
      tether: 'usdt',
      ripple: 'xrp',
      dogecoin: 'doge'
    };

    // ساخت آرایه ارزها با قیمت‌های واقعی
    const result = COINS.map(coin => {
      const apiId = Object.keys(idMap).find(key => idMap[key] === coin.id);
      const priceData = data[apiId];
      
      // اگر قیمت TON دریافت نشد، از قیمت جایگزین استفاده کن
      let price = priceData?.usd || 0;
      let change24h = priceData?.usd_24h_change || 0;
      
      // 🟢 اگر قیمت TON صفر بود، از یک قیمت پیش‌فرض استفاده کن
      if (coin.id === 'ton' && price === 0) {
        price = 5.42; // قیمت تقریبی TON
        change24h = 3.5;
        console.log('⚠️ قیمت TON از CoinGecko دریافت نشد، از مقدار پیش‌فرض استفاده شد');
      }

      return {
        ...coin,
        price: price,
        change24h: change24h,
        miningPower: coin.id === 'btc' ? 0.0001 : 
                     coin.id === 'eth' ? 0.001 :
                     coin.id === 'ton' ? 0.01 :
                     coin.id === 'sol' ? 0.005 :
                     coin.id === 'bnb' ? 0.002 :
                     coin.id === 'xrp' ? 0.02 :
                     coin.id === 'doge' ? 0.05 :
                     coin.id === 'trx' ? 0.1 : 0,
        balance: 0
      };
    });

    return result;
  } catch (error) {
    console.error('❌ خطا در دریافت قیمت‌ها:', error);
    
    // 🟡 در صورت خطا، از داده‌های پیش‌فرض استفاده کن
    return COINS.map(coin => ({
      ...coin,
      price: coin.id === 'ton' ? 1.45 : 
             coin.id === 'btc' ? 70000 : 
             coin.id === 'eth' ? 2440 : 
             coin.id === 'sol' ? 98 : 
             coin.id === 'bnb' ? 700 : 
             coin.id === 'xrp' ? 1.5 : 
             coin.id === 'doge' ? 0.8 : 
             coin.id === 'trx' ? 0.34 : 
             coin.id === 'usdt' ? 1 : 0,
      change24h: 0,
      miningPower: coin.id === 'btc' ? 0.0001 : 
                   coin.id === 'eth' ? 0.001 :
                   coin.id === 'ton' ? 0.01 :
                   coin.id === 'sol' ? 0.005 :
                   coin.id === 'bnb' ? 0.002 :
                   coin.id === 'xrp' ? 0.02 :
                   coin.id === 'doge' ? 0.05 :
                   coin.id === 'trx' ? 0.1 : 0,
      balance: 0
    }));
  }
};