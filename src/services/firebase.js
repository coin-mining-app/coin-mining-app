import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// 🔥 تنظیمات Firebase (از متغیرهای محیطی)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyCCw5eJMKbE23x4jXCYQa50cdpftAhyJ7Q',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'coin-mining-web-8fe39.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'coin-mining-web-8fe39',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'coin-mining-web-8fe39.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '904272959004',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:904272959004:web:84b60508eedf3f03d2b1d9',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-NS1KTHRXS0'
};

// 🔥 مقداردهی اولیه Firebase
let app;
let db;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  analytics = getAnalytics(app);
  console.log('✅ Firebase initialized successfully');
  console.log('📊 Project ID:', firebaseConfig.projectId);
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

// 📦 کلاس مدیریت دیتابیس
class DatabaseService {
  constructor() {
    this.db = db;
    this.isConnected = false;
  }

  async checkConnection() {
    try {
      if (!this.db) {
        console.warn('⚠️ Firebase not initialized');
        return false;
      }
      const testQuery = await getDocs(collection(this.db, 'test'));
      this.isConnected = true;
      console.log('✅ Firebase connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Firebase connection error:', error);
      this.isConnected = false;
      return false;
    }
  }

  async setDocument(collectionName, docId, data) {
    try {
      if (!this.db) {
        throw new Error('Firebase not initialized');
      }
      const docRef = doc(this.db, collectionName, docId);
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return { success: true, id: docId };
    } catch (error) {
      console.error('Error setting document:', error);
      return { success: false, error: error.message };
    }
  }

  async getDocument(collectionName, docId) {
    try {
      if (!this.db) {
        throw new Error('Firebase not initialized');
      }
      const docRef = doc(this.db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Document not found' };
      }
    } catch (error) {
      console.error('Error getting document:', error);
      return { success: false, error: error.message };
    }
  }

  async getAllDocuments(collectionName) {
    try {
      if (!this.db) {
        throw new Error('Firebase not initialized');
      }
      const querySnapshot = await getDocs(collection(this.db, collectionName));
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: documents };
    } catch (error) {
      console.error('Error getting documents:', error);
      return { success: false, error: error.message };
    }
  }

  async queryDocuments(collectionName, field, value) {
    try {
      if (!this.db) {
        throw new Error('Firebase not initialized');
      }
      const q = query(collection(this.db, collectionName), where(field, '==', value));
      const querySnapshot = await getDocs(q);
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: documents };
    } catch (error) {
      console.error('Error querying documents:', error);
      return { success: false, error: error.message };
    }
  }

  async getOrderedDocuments(collectionName, field, direction = 'desc', limitCount = 10) {
    try {
      if (!this.db) {
        throw new Error('Firebase not initialized');
      }
      const q = query(
        collection(this.db, collectionName),
        orderBy(field, direction),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: documents };
    } catch (error) {
      console.error('Error getting ordered documents:', error);
      return { success: false, error: error.message };
    }
  }

  listenToCollection(collectionName, callback) {
    try {
      if (!this.db) {
        console.warn('⚠️ Firebase not initialized');
        return () => {};
      }
      const q = query(collection(this.db, collectionName));
      return onSnapshot(q, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        callback(documents);
      });
    } catch (error) {
      console.error('Error listening to collection:', error);
      return () => {};
    }
  }

  async deleteDocument(collectionName, docId) {
    try {
      if (!this.db) {
        throw new Error('Firebase not initialized');
      }
      await deleteDoc(doc(this.db, collectionName, docId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { success: false, error: error.message };
    }
  }

  // 📝 ذخیره کاربر
  async saveUser(userData) {
    return this.setDocument('users', userData.id, userData);
  }

  async getUser(userId) {
    return this.getDocument('users', userId);
  }

  async getAllUsers() {
    return this.getAllDocuments('users');
  }

  // 💰 ذخیره تراکنش
  async saveTransaction(transactionData) {
    const id = Date.now().toString();
    return this.setDocument('transactions', id, {
      ...transactionData,
      id: id
    });
  }

  async getUserTransactions(userId) {
    return this.queryDocuments('transactions', 'userId', userId);
  }

  // 🎯 ذخیره ماموریت
  async saveMission(missionData) {
    const id = `${missionData.userId}_${missionData.day}`;
    return this.setDocument('missions', id, missionData);
  }

  async getUserMissions(userId) {
    return this.queryDocuments('missions', 'userId', userId);
  }

  // 🏆 ذخیره VIP
  async saveVip(vipData) {
    return this.setDocument('vips', vipData.userId, vipData);
  }

  // 🔗 ذخیره دعوت
  async saveReferral(referralData) {
    const id = `${referralData.inviter}_${referralData.invited}`;
    return this.setDocument('referrals', id, referralData);
  }

  async getUserReferrals(userId) {
    return this.queryDocuments('referrals', 'inviter', userId);
  }

  // 🎫 ذخیره تیکت
  async saveTicket(ticketData) {
    const id = Date.now().toString();
    return this.setDocument('tickets', id, {
      ...ticketData,
      id: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  async getUserTickets(userId) {
    return this.queryDocuments('tickets', 'userId', userId);
  }

  async getAllTickets() {
    return this.getAllDocuments('tickets');
  }

  async updateTicket(ticketId, data) {
    return this.setDocument('tickets', ticketId, data);
  }

  async getStats() {
    const users = await this.getAllUsers();
    const transactions = await this.getAllDocuments('transactions');
    const referrals = await this.getAllDocuments('referrals');
    const tickets = await this.getAllDocuments('tickets');
    
    let totalRevenue = 0;
    transactions.data?.forEach(tx => {
      if (tx.type === 'پرداخت') {
        totalRevenue += tx.amount;
      }
    });

    return {
      totalUsers: users.data?.length || 0,
      totalTransactions: transactions.data?.length || 0,
      totalRevenue: totalRevenue,
      totalReferrals: referrals.data?.length || 0,
      totalTickets: tickets.data?.length || 0
    };
  }
}

export const dbService = new DatabaseService();
export { db, analytics };