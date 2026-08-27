import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function RulesModal({ onAccept, onLater }) {
  const { t } = useLanguage();
  
  const rules = [
    t('rules_1') || 'تمرکز روی فعال‌سازی سطح باشگاه VIP',
    t('rules_2') || 'معرفی دوستان و دریافت ۱۰٪ از واریز آن‌ها',
    t('rules_3') || 'انجام ماموریت‌های روزانه برای افزایش موجودی',
    t('rules_4') || 'حداقل برداشت: ۵۰۰ TON',
    t('rules_5') || 'ماینرها ۳۰ روز فعالیت دارند',
    t('rules_6') || 'تمام موجودی‌ها باید به TON تبدیل شوند',
    t('rules_7') || 'ورود روزانه برای دریافت پاداش زنجیره‌ای',
    t('rules_8') || 'تقویت ماینرها: ۳۰ دقیقه سرعت دو برابر',
    t('rules_9') || 'تقلب = بستن یک‌طرفه حساب',
    t('rules_10') || 'بازخورد = دریافت پاداش'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8">
        <div className="text-center mb-6">
          <span className="text-6xl block mb-3">📋</span>
          <h2 className="text-2xl font-bold text-gray-800">{t('rules_title')}</h2>
          <p className="text-sm text-gray-500 mt-1">لطفاً قبل از شروع مطالعه کنید</p>
        </div>
        <div className="max-h-60 overflow-y-auto text-sm space-y-2 text-gray-700 p-3 bg-gray-50 rounded-2xl">
          {rules.map((rule, index) => (
            <div key={index} className="flex gap-2">
              <span className="text-blue-600 font-bold">{index + 1}.</span>
              <span>{rule}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onAccept} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg">
            {t('go_to_rules')}
          </button>
          <button onClick={onLater} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all">
            {t('later')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RulesModal;