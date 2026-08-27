import React, { useState, useEffect } from 'react';
import { dbService } from '../services/firebase';
import { showNotification } from '../utils/notification';

function FirebaseTest() {
  const [status, setStatus] = useState('در حال بررسی...');
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setLoading(true);
    setStatus('در حال اتصال...');
    setError(null);
    
    try {
      // تست اتصال
      const connected = await dbService.checkConnection();
      
      if (connected) {
        setStatus('✅ متصل');
        showNotification.success('✅ اتصال Firebase برقرار است!');
        
        // تست ذخیره‌سازی
        const testResult = await dbService.setDocument('test', 'test_doc', {
          message: 'تست اتصال',
          timestamp: new Date().toISOString()
        });
        
        if (testResult.success) {
          setTestData({
            message: '✅ ذخیره‌سازی با موفقیت انجام شد',
            id: testResult.id
          });
        }
      } else {
        setStatus('❌ قطع است');
        setError('اتصال به Firebase برقرار نشد');
        showNotification.error('❌ اتصال Firebase برقرار نیست!');
      }
    } catch (error) {
      setStatus('❌ خطا');
      setError(error.message);
      showNotification.error('❌ خطا در تست اتصال: ' + error.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="glass-card">
      <h3 className="font-bold text-gray-800 text-xl mb-4">🔍 تست اتصال Firebase</h3>
      
      <div className="space-y-4">
        {/* وضعیت اتصال */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-sm text-gray-600">وضعیت اتصال</p>
            <p className={`text-lg font-bold ${
              status === '✅ متصل' ? 'text-green-600' : 
              status === '❌ قطع است' ? 'text-red-600' : 
              'text-gray-400'
            }`}>
              {loading ? '⏳ در حال بررسی...' : status}
            </p>
          </div>
          <button 
            onClick={testConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? '⏳ در حال تست...' : '🔄 تست مجدد'}
          </button>
        </div>

        {/* نتیجه تست */}
        {testData && (
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-700">{testData.message}</p>
            <p className="text-xs text-green-500 mt-1">شناسه: {testData.id}</p>
          </div>
        )}

        {/* خطا */}
        {error && (
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <p className="text-sm text-red-700">❌ {error}</p>
          </div>
        )}

        {/* اطلاعات تنظیمات */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-gray-600">تنظیمات Firebase:</p>
          <div className="mt-2 space-y-1 text-xs text-gray-500 font-mono">
            <p>Project ID: {process.env.REACT_APP_FIREBASE_PROJECT_ID || '❌ تنظیم نشده'}</p>
            <p>Auth Domain: {process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '❌ تنظیم نشده'}</p>
            <p>API Key: {process.env.REACT_APP_FIREBASE_API_KEY ? '✅ تنظیم شده' : '❌ تنظیم نشده'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirebaseTest;