import * as Keychain from 'react-native-keychain';

export const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await Keychain.getGenericPassword({ service: key });
      if (item) {
        console.log(`${key} was used 🔐 \n`);
        return item.password;
      } else {
        console.log('No values stored under key: ' + key);
        return null;
      }
    } catch (error) {
      console.error('Keychain get item error: ', error);
      await Keychain.resetGenericPassword({ service: key });
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await Keychain.setGenericPassword(value, '', { service: key });
    } catch (err) {
      console.error('Error saving token:', err);
      return;
    }
  },
};
