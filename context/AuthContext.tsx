import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth, listenForAuthChanges, db } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  deleteUser,
  sendEmailVerification,
  ActionCodeSettings,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveUser } from "@/db/service/UserService";
import { getRealm } from "@/db/realm";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { downloadBackup } from "@/constants/backupService";
import restoreRealmData from "@/constants/restoreBackupFromFirebase";
import { resetAppInstallationStatus } from "@/constants/appInstallation";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  resetInstallationStatus: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  signInForVerification: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenForAuthChanges(
      async (firebaseUser: User | null) => {
        if (firebaseUser && firebaseUser.emailVerified) {
          setUser(firebaseUser);
        } else if (!firebaseUser) {
          setUser(null);
        }
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const fetchBackup = async (userId: string) => {
    const realm = await getRealm();
    try {
      const backupData: any = await downloadBackup(userId);
      await restoreRealmData(realm, backupData);
    } catch (error) {}
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      
      if (!user.emailVerified) {
        await firebaseSignOut(auth);
        throw new Error("Please verify your email before signing in");
      }
      
      await AsyncStorage.setItem("isLoggedIn", "true");
      fetchBackup(user.uid);
      const name = email.split("@")[0];
      const profilePicture = user.photoURL ?? "";
      await saveUser({ name, email, profilePicture, lastOpened: new Date() });
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const signInForVerification = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (error: any) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      
      const actionCodeSettings: ActionCodeSettings = {
        url: 'https://slayday-3ab3e.firebaseapp.com/__/auth/action',
        handleCodeInApp: true,
      };
      
      await sendEmailVerification(user, actionCodeSettings);
      
      await AsyncStorage.setItem("isLoggedIn", "false");
      
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      await AsyncStorage.setItem("isLoggedIn", "false");
      const realm = await getRealm();
      realm.write(() => {
        realm.deleteAll();
      });
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No user logged in");
      // Delete Firestore docs
      const backupsRef = collection(db, "users", currentUser.uid, "backup");
      const backupDocs = await getDocs(backupsRef);
      const deleteBackupPromises = backupDocs.docs.map((docSnap) =>
        deleteDoc(docSnap.ref)
      );
      await Promise.all(deleteBackupPromises);
      // Delete user document
      const userDocRef = doc(db, "users", currentUser.uid);
      await deleteDoc(userDocRef);
      // Clear Realm
      const realm = await getRealm();
      realm.write(() => {
        realm.deleteAll();
      });
      // Delete Firebase user
      await deleteUser(currentUser);
      await AsyncStorage.setItem("isLoggedIn", "false");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetInstallationStatus = async () => {
    await resetAppInstallationStatus();
  };

  const sendVerificationEmail = async () => {
    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.emailVerified) {
      const actionCodeSettings: ActionCodeSettings = {
        url: 'https://slayday-3ab3e.firebaseapp.com/__/auth/action',
        handleCodeInApp: true,
      };
      await sendEmailVerification(currentUser, actionCodeSettings);
    } else if (!currentUser) {
      throw new Error("No user logged in to send verification email");
    } else {
      throw new Error("Email is already verified");
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        loading, 
        signIn, 
        signUp, 
        signOut, 
        deleteAccount, 
        resetInstallationStatus, 
        sendVerificationEmail,
        signInForVerification
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
