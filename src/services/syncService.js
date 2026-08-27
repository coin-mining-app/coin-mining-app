import { db } from './firebase';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { authService } from './authService';

class SyncService {
  constructor() {
    this.collectionName = 'users';
  }

  // همگام‌سازی کامل داده‌ها با Firebase
  async syncAllData() {
    const user = authService.getCurrentUser();
    if (!user) {
      return { success: false, message: 'کاربر وارد نشده است' };
    }

    try {
      const ref = doc(collection(db, this.collectionName), user.username);

      const localData = {
        user,
        simTonBalance: Number(localStorage.getItem('simTonBalance') || 0),
        vipLevel: Number(localStorage.getItem('vipLevel') || 0),
        userLevel: Number(localStorage.getItem('userLevel') || 1),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(ref, localData, { merge: true });

      localStorage.setItem('lastSync', new Date().toISOString());

      return { success: true };
    } catch (error) {
      console.error('Sync error:', error);
      return { success: false, message: 'خطا در همگام‌سازی' };
    }
  }

  // بارگذاری داده‌های کاربر از Firebase
  async loadRemoteData(username) {
    try {
      const ref = doc(collection(db, this.collectionName), username);
      const snap = await getDoc(ref);

      if (!snap.exists()) return null;

      return snap.data();
    } catch (error) {
      console.error('Load remote error:', error);
      return null;
    }
  }
}

export const syncService = new SyncService();
