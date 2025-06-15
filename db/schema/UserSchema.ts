export const UserSchema: Realm.ObjectSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    userName: 'string?',
    email: 'string',
    profilePicture: 'string?',
    lastOpened: 'date',
    preferences: 'UserPreferences?',
  },
};

export const UserPreferencesSchema: Realm.ObjectSchema = {
  name: 'UserPreferences',
  embedded: true,
  properties: {
    jsonUploadEnabled: { type: 'bool', default: false },
    automaticBackupEnabled: {type: 'bool', default: true}
  },
};

export const schemas = [UserSchema, UserPreferencesSchema]