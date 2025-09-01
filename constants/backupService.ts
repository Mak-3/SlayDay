import { auth, db } from "../firebaseConfig";
import Toast from "react-native-toast-message";
import exportRealmDataAsJson from "./exportRealmDataAsJson";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function triggerBackup() {
  try {
    const backup = await exportRealmDataAsJson();

    const firebaseUser = auth.currentUser;

    if (firebaseUser?.uid) {
      await uploadBackup(firebaseUser.uid, backup);
      Toast.show({
        type: "success",
        text1: "Backup successfull",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Backup failed",
        text2: "User not logged in",
      });
      console.error("Backup error: User not logged in");
    }
  } catch (err: any) {
    Toast.show({
      type: "error",
      text1: "Backup failed",
      text2: err.message,
    });
    console.error("Backup error:", err);
  }
}

export async function uploadBackup(userId: string, backupData: any) {
  const backupRef = doc(db, "users", userId, "backup", "data");
  await setDoc(backupRef, {
    ...backupData,
    lastBackupDate: new Date().toISOString(),
  });
}

export async function downloadBackup(userId: string) {
  const backupRef = doc(db, "users", userId, "backup", "data");
  const backupSnap = await getDoc(backupRef);
  if (backupSnap.exists()) {
    return backupSnap.data();
  }
  return null;
}
