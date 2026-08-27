import React, { useState } from 'react';
import { showNotification } from '../utils/notification';

function SupportTicket() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showNotification.warning('⚠️ لطفاً موضوع و پیام را وارد کنید');
      return;
    }
    showNotification.success('✅ تیکت شما با موفقیت ارسال شد');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="glass-card">
        <h3 className="font-bold text-gray-800 text-xl mb-4 flex items-center">
          <span className="text-blue-600 mr-2">🎫</span> سیستم پشتیبانی
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">موضوع</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="موضوع تیکت را وارد کنید"
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">پیام</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="مشکل خود را توضیح دهید..."
              rows="5"
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold hover:scale-105 transition-all"
          >
            📤 ارسال تیکت
          </button>
        </form>

        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 text-center">
            💡 تیکت شما در اسرع وقت بررسی خواهد شد
          </p>
        </div>
      </div>
    </div>
  );
}

export default SupportTicket;