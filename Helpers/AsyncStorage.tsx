import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeDataObject = async (key: string, value: object) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error storing data object in AsyncStorage: ' + e);
  }
};

export const getDataObject = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error returning data object in AsyncStorage: ' + e);
  }
};

export const getAllKeys = async () => {
  let keys: string[] = [];
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    console.error('Error returning all data objects in AsyncStorage: ' + e);
  }
  return keys;
};
