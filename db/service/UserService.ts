import Realm from "realm";
import { getRealm } from "../realm";

const USER_ID = "current_user";

// Save or update user with default preferences if missing
export const saveUser = async (user: {
  name: string;
  userName?: string;
  profilePicture?: string;
  lastOpened: Date;
  email: string;
  preferences?: {
    jsonUploadEnabled?: boolean;
    automaticBackupEnabled?: boolean;
  };
}) => {
  const realm = await getRealm();
  const existingUser = realm.objectForPrimaryKey("User", USER_ID);

  let updatedPreferences: any = {
    jsonUploadEnabled: false,
    automaticBackupEnabled: true,
  };

  if (existingUser && existingUser.preferences) {
    updatedPreferences = {
      ...existingUser.preferences,
      ...user.preferences,
    };
  } else if (user.preferences) {
    updatedPreferences = {
      jsonUploadEnabled: user.preferences?.jsonUploadEnabled ?? false,
      automaticBackupEnabled: user.preferences?.automaticBackupEnabled ?? true,
    };
  }

  realm.write(() => {
    realm.create(
      "User",
      {
        id: USER_ID,
        ...user,
        preferences: updatedPreferences,
      },
      Realm.UpdateMode.Modified
    );
  });
};

// Get the only user
export const getUser = async () => {
  const realm = await getRealm();
  const user = realm.objectForPrimaryKey("User", USER_ID);
  const result = user ? { ...user.toJSON() } : null;
  return result;
};

// Delete the user
export const deleteUser = async () => {
  const realm = await getRealm();
  const user = realm.objectForPrimaryKey("User", USER_ID);
  if (user) {
    realm.write(() => {
      realm.delete(user);
    });
  }
};
