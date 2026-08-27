import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { showNotification } from '../utils/notification';
import { notificationService } from '../services/notificationService';

function Settings({ onLanguageChange }) {
  const { t } = useLanguage();
  const [showRules, setShowRules] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const rulesList = [
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

  const aboutText = t('about_text') || `Coin Mining یک پلتفرم پیشرفته برای استخراج ارزهای دیجیتال است.`;

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) {
      showNotification.warning('⚠️ لطفاً پیام خود را وارد کنید');
      return;
    }
    const allFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    allFeedbacks.push({ message: feedback, date: new Date().toISOString() });
    localStorage.setItem('feedbacks', JSON.stringify(allFeedbacks));
    setFeedbackSent(true);
    showNotification.success('✅ بازخورد شما با موفقیت ارسال شد');
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedback('');
    }, 3000);
  };

  // 🔔 تست اعلان
  const testNotification = () => {
    try {
      notificationService.sendNotification(
        '🔔 تست اعلان',
        'اگر این پیام را می‌بینید، اعلان‌ها فعال هستند!'
      );
      showNotification.success('✅ اعلان تست ارسال شد!');
    } catch (error) {
      showNotification.warning('ℹ️ اعلان‌ها در این مرورگر پشتیبانی نمیشوند');
    }
  };

  return (
    <div className="glass-card">
      <h3 className="font-bold text-gray-800 text-xl mb-4 flex items-center">
        <span className="text-blue-600 mr-2">⚙️</span> {t('settings_title')}
      </h3>
      <div className="space-y-3">
        <button onClick={onLanguageChange} className="w-full p-4 bg-gray-50 rounded-xl text-right text-gray-800 hover:bg-blue-50 transition-all flex items-center justify-between">
          <span className="flex items-center gap-2"><span className="text-xl">🌍</span> {t('change_language')}</span>
          <span className="text-gray-400">↵</span>
        </button>

        <button onClick={() => setShowRules(!showRules)} className="w-full p-4 bg-gray-50 rounded-xl text-right text-gray-800 hover:bg-blue-50 transition-all flex items-center justify-between">
          <span className="flex items-center gap-2"><span className="text-xl">📋</span> {t('rules_guidelines')}</span>
          <span className="text-gray-400">{showRules ? '▲' : '▼'}</span>
        </button>
        {showRules && (
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200">
            <div className="max-h-60 overflow-y-auto space-y-2 text-sm text-gray-700">
              {rulesList.map((rule, index) => (
                <div key={index} className="flex gap-2 p-2 bg-white/50 rounded-lg">
                  <span className="text-blue-600 font-bold">{index + 1}.</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => setShowAbout(!showAbout)} className="w-full p-4 bg-gray-50 rounded-xl text-right text-gray-800 hover:bg-blue-50 transition-all flex items-center justify-between">
          <span className="flex items-center gap-2"><span className="text-xl">ℹ️</span> {t('about_us')}</span>
          <span className="text-gray-400">{showAbout ? '▲' : '▼'}</span>
        </button>
        {showAbout && (
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200">
            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{aboutText}</div>
            <div className="mt-3 p-3 bg-white/50 rounded-lg text-xs text-gray-500">
              <p>📧 {t('email_label')}: support@coin-mining.com</p>
              <p>🌐 {t('website')}: coin-mining.com</p>
            </div>
          </div>
        )}

        <div className="w-full p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 mb-3"><span className="text-xl">💬</span><span className="text-gray-800 font-medium">{t('feedback')}</span></div>
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder={t('feedback_placeholder')} rows="3" className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm" disabled={feedbackSent} />
          <button onClick={handleFeedbackSubmit} disabled={feedbackSent} className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 text-sm">
            {feedbackSent ? '✅ ' + t('feedback_sent') : '📤 ' + t('send_feedback')}
          </button>
        </div>

        {/* 🔔 دکمه تست اعلان */}
        <button 
          onClick={testNotification}
          className="w-full p-4 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all flex items-center justify-between"
        >
          <span className="flex items-center gap-2"><span className="text-xl">🔔</span> تست اعلان</span>
          <span className="text-gray-400">→</span>
        </button>
      </div>
    </div>
  );
}

export default Settings;