import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeDataObject = async (key: string, value: object) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const getDataObject = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const getAllKeys = async () => {
  let keys: string[] = [];
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    // read key error
  }

  return keys;
};
