import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface UserDocument {
  uid: string;
  email: string;
  displayName: string | null;
  hasOnboarded: boolean;
  createdAt: Timestamp;
  businessProfile?: Record<string, any>;
}

export class DbService {
  // Save onboarding data
  static async saveOnboarding(uid: string, businessProfile: Record<string, any>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        hasOnboarded: true,
        businessProfile,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error: any) {
      throw new Error(`Failed to save onboarding: ${error.message}`);
    }
  }

  // Get user document
  static async getUser(uid: string): Promise<UserDocument | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return null;
      }
      
      return userSnap.data() as UserDocument;
    } catch (error: any) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Create user document on first signup
  static async createUserDocument(uid: string, email: string, displayName: string | null): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        uid,
        email,
        displayName,
        hasOnboarded: false,
        createdAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(`Failed to create user document: ${error.message}`);
    }
  }

  // Update user document
  static async updateUser(uid: string, updates: Partial<UserDocument>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
}
