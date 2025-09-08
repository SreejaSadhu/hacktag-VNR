import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  reload,
  User
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export class FirebaseAuthService {
  static async signUp(email: string, password: string): Promise<User> {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    return user;
  }

  static async signIn(email: string, password: string): Promise<User> {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  }

  static async signOut(): Promise<void> {
    await signOut(auth);
  }

  static async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  static async sendEmailVerification(): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently signed in.");
    await sendEmailVerification(user);
  }

  static subscribeToAuthChanges(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  static async reloadCurrentUser(): Promise<void> {
    const user = auth.currentUser;
    if (user) await reload(user);
  }
}
