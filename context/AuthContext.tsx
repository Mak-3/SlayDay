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
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveUser } from "@/db/service/UserService";
import { getRealm } from "@/db/realm";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { downloadBackup } from "@/constants/backupService";
import restoreRealmData from "@/constants/restoreBackupFromFirebase";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
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
        setUser(firebaseUser);
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

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const name = email.split("@")[0];
      const profilePicture = user.photoURL ?? "";
      await AsyncStorage.setItem("isLoggedIn", "true");
      await saveUser({ name, email, profilePicture, lastOpened: new Date() });
      setUser(user);
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

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
};
