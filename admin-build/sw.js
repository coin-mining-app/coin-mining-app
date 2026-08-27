// 📢 Service Worker برای اعلان‌های پوش

self.addEventListener('install', function(event) {
  console.log('✅ Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('✅ Service Worker activated');
  event.waitUntil(clients.claim());
});

self.addEventListener('push', function(event) {
  console.log('📢 Push notification received:', event);

  let data = {
    title: 'Coin Mining',
    body: 'اعلان جدیدی دریافت شد!',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    data: {
      url: '/'
    }
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/logo192.png',
    badge: data.badge || '/logo192.png',
    vibrate: data.vibrate || [200, 100, 200],
    requireInteraction: data.requireInteraction || true,
    data: data.data || { url: '/' },
    actions: data.actions || [
      { action: 'open', title: '📂 باز کردن' },
      { action: 'close', title: '❌ بستن' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Coin Mining', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('📢 Notification clicked:', event);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(clientList) {
      // اگر پنجره باز هست، به اونجا برو
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      // اگر پنجره باز نیست، یکی باز کن
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// 📡 دریافت اعلان از سرور (برای VAPID)
self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('📡 Push subscription changed');
  // اینجا میتونیم اشتراک جدید رو به سرور بفرستیم
});