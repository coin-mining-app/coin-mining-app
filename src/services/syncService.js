import { dbService } from './firebase';
import { authService } from './authService';
import { paymentService } from './paymentService';

class SyncService {
  constructor() {
    this.isSyncing = false;
    this.lastSync = null;
  }

  // 🔄 همگام‌سازی داده‌ها با Firebase
  async syncAllData() {
    if (this.isSyncing) {
      console.log('⚠️ Sync already in progress');
      return;
    }

    this.isSyncing = true;
    console.log('🔄 Starting sync...');

    try {
      // ۱. همگام‌سازی کاربران
      await this.syncUsers();
      
      // ۲. همگام‌سازی تراکنش‌ها
      await this.syncTransactions();
      
      // ۳. همگام‌سازی دعوت‌ها
      await this.syncReferrals();
      
      // ۴. همگام‌سازی ماموریت‌ها
      await this.syncMissions();

      this.lastSync = new Date().toISOString();
      localStorage.setItem('lastSync', this.lastSync);
      
      console.log('✅ Sync completed successfully!');
      return { success: true, lastSync: this.lastSync };
    } catch (error) {
      console.error('❌ Sync failed:', error);
      return { success: false, error: error.message };
    } finally {
      this.isSyncing = false;
    }
  }

  // 👤 همگام‌سازی کاربران
  async syncUsers() {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      await dbService.saveUser(currentUser);
    }
    
    const users = authService.getAllUsers();
    for (const user of users) {
      await dbService.saveUser(user);
    }
  }

  // 💰 همگام‌سازی تراکنش‌ها
  async syncTransactions() {
    const transactions = paymentService.getTransactions();
    const currentUser = authService.getCurrentUser();
    
    for (const tx of transactions) {
      await dbService.saveTransaction({
        ...tx,
        userId: currentUser?.id || 'anonymous'
      });
    }
  }

  // 🔗 همگام‌سازی دعوت‌ها
  async syncReferrals() {
    const referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
    for (const ref of referrals) {
      await dbService.saveReferral(ref);
    }
  }

  // 🎯 همگام‌سازی ماموریت‌ها
  async syncMissions() {
    const missions = JSON.parse(localStorage.getItem('dailyMissions') || '{}');
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      await dbService.saveMission({
        ...missions,
        userId: currentUser.id
      });
    }
  }

  // 📥 بارگذاری داده‌ها از Firebase
  async loadAllData() {
    console.log('📥 Loading data from Firebase...');

    try {
      // ۱. بارگذاری کاربران
      const usersResult = await dbService.getAllUsers();
      if (usersResult.success) {
        for (const user of usersResult.data) {
          // به‌روزرسانی کاربران در localStorage
          const localUsers = authService.getAllUsers();
          const index = localUsers.findIndex(u => u.id === user.id);
          if (index !== -1) {
            localUsers[index] = { ...localUsers[index], ...user };
          } else {
            localUsers.push(user);
          }
          authService.saveUsers(localUsers);
        }
      }

      // ۲. بارگذاری تراکنش‌ها
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const txResult = await dbService.getUserTransactions(currentUser.id);
        if (txResult.success) {
          // به‌روزرسانی تراکنش‌ها
          const txData = txResult.data.map(tx => ({
            id: tx.id,
            type: tx.type,
            amount: tx.amount,
            description: tx.description,
            date: tx.date,
            status: tx.status
          }));
          localStorage.setItem('transactions', JSON.stringify(txData));
        }
      }

      console.log('✅ Data loaded successfully!');
      return { success: true };
    } catch (error) {
      console.error('❌ Error loading data:', error);
      return { success: false, error: error.message };
    }
  }

  // 📊 دریافت آمار از Firebase
  async getStats() {
    return dbService.getStats();
  }
}

export const syncService = new SyncService();