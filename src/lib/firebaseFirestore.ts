import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface BusinessProfile {
  id?: string;
  userId: string;
  businessName: string;
  topOfferings: string[];
  businessType: string;
  userGoal: string;
  brandTone: "friendly" | "professional" | "bold" | "minimal";
  createdAt: any;
  updatedAt: any;
}

export interface Website {
  id?: string;
  userId: string;
  title: string;
  description: string;
  html: string;
  css: string;
  createdAt: any;
  updatedAt: any;
}

export interface GeneratedImage {
  id?: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  style: string;
  size: string;
  quality: string;
  createdAt: any;
}

export class FirebaseFirestoreService {
  // Business Profiles
  static async createBusinessProfile(profile: Omit<BusinessProfile, "id" | "createdAt" | "updatedAt" | "userId">): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const docRef = await addDoc(collection(db, "businessProfiles"), {
      ...profile,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getBusinessProfile(): Promise<BusinessProfile | null> {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const q = query(
      collection(db, "businessProfiles"),
      where("userId", "==", user.uid),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as BusinessProfile;
  }

  static async updateBusinessProfile(profileId: string, updates: Partial<BusinessProfile>): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const docRef = doc(db, "businessProfiles", profileId);
    await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
  }

  // Websites
  static async saveWebsite(website: Omit<Website, "id" | "createdAt" | "updatedAt" | "userId">): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const docRef = await addDoc(collection(db, "websites"), {
      ...website,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getUserWebsites(): Promise<Website[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const q = query(
      collection(db, "websites"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Website[];
  }

  // Generated Images
  static async saveGeneratedImage(image: Omit<GeneratedImage, "id" | "createdAt" | "userId">): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const docRef = await addDoc(collection(db, "generatedImages"), {
      ...image,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getUserImages(): Promise<GeneratedImage[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const q = query(
      collection(db, "generatedImages"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as GeneratedImage[];
  }
}
