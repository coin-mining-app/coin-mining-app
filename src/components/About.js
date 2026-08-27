import React from 'react';

function About() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="glass-card">
        <h3 className="font-bold text-gray-800 text-2xl mb-6 flex items-center">
          <span className="text-blue-600 mr-3">ℹ️</span> درباره ما
        </h3>

        <div className="space-y-6">
          {/* معرفی */}
          <div className="p-5 bg-gradient-to-r from-blue-50 to-white rounded-2xl border border-blue-200/50">
            <h4 className="font-bold text-gray-800 text-lg mb-3">🚀 Coin Mining</h4>
            <p className="text-gray-700 leading-relaxed">
              Coin Mining یک پلتفرم پیشرفته و نوآورانه برای استخراج ارزهای دیجیتال است. 
              این پلتفرم با هدف ایجاد فرصت‌های درآمدی برای کاربران در سراسر جهان طراحی شده است.
            </p>
          </div>

          {/* ماموریت */}
          <div className="p-5 bg-gradient-to-r from-green-50 to-white rounded-2xl border border-green-200/50">
            <h4 className="font-bold text-gray-800 text-lg mb-3">🎯 ماموریت ما</h4>
            <p className="text-gray-700 leading-relaxed">
              ما به دنبال دموکراتیزه کردن فرصت‌های استخراج ارزهای دیجیتال هستیم. 
              با ارائه ابزارهای ساده و قدرتمند، به کاربران امکان می‌دهیم تا بدون نیاز به دانش فنی پیشرفته، 
              از پتانسیل بازار ارزهای دیجیتال بهره‌مند شوند.
            </p>
          </div>

          {/* ویژگی‌ها */}
          <div className="p-5 bg-gradient-to-r from-purple-50 to-white rounded-2xl border border-purple-200/50">
            <h4 className="font-bold text-gray-800 text-lg mb-3">✨ ویژگی‌های کلیدی</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-purple-500">✓</span>
                استخراج همزمان ۹ ارز دیجیتال معتبر
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-500">✓</span>
                ماینرهای رایگان و اجاره‌ای با قدرت‌های مختلف
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-500">✓</span>
                سیستم VIP با ۴ سطح و مزایای ویژه
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-500">✓</span>
                اتصال امن به کیف پول TON
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-500">✓</span>
                پشتیبانی ۲۴ ساعته، ۷ روز هفته
              </li>
            </ul>
          </div>

          {/* تماس */}
          <div className="p-5 bg-gradient-to-r from-orange-50 to-white rounded-2xl border border-orange-200/50">
            <h4 className="font-bold text-gray-800 text-lg mb-3">📬 ارتباط با ما</h4>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <span className="text-orange-500">📧</span>
                ایمیل: <span className="font-mono text-blue-600">support@t.me/coin_mining_app</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-orange-500">🌐</span>
                وبسایت: <span className="font-mono text-blue-600">www.coin-mining.com</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-orange-500">📱</span>
                تلگرام: <span className="font-mono text-blue-600">@Mining_crypto_coin_bot</span>
              </p>
            </div>
          </div>

          {/* نسخه */}
          <div className="text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
            <p>نسخه ۱.۰.۰ | ساخته شده با ❤️ توسط تیم Coin Mining</p>
            <p className="mt-1">© {new Date().getFullYear()} کلیه حقوق محفوظ است</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;