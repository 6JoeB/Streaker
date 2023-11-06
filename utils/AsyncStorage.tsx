import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeDataObject = async (key: string, value: object) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error storing data object in AsyncStorage, ' + e);
  }
};

export const getDataObject = async (key: string, setData: any) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? setData(JSON.parse(jsonValue)) : null;
  } catch (e) {
    console.error('Error returning data object in AsyncStorage, ' + e);
  }
};

export const getDataObjects = async (keys, setData) => {
  try {
    const values = await Promise.all(
      keys.map(key =>
        AsyncStorage.getItem(key).then(jsonData => JSON.parse(jsonData)),
      ),
    );

    setData(values.filter(item => item !== null));
  } catch (e) {
    console.error('Error returning data objects in AsyncStorage, ' + e);
  }
};

export const getAllKeys = async (setAsyncStorageKeys: any) => {
  let keys: string[] = [];
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    console.error('Error returning all keys in AsyncStorage, ' + e);
  }
  setAsyncStorageKeys(keys);
};

export const removeValue = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error removing key, ' + e);
  }
};

export const setObjectValue = async (key: string, value: object) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (e) {
    console.error('Error updating key, ' + e);
  }
};

export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    console.log('cleared');
  } catch (e) {
    console.error('Error clearing all, ' + e);
  }
};
