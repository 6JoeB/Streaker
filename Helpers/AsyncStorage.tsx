import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeDataObject = async (key: string, value: object) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error storing data object in AsyncStorage, error: ' + e);
  }
};

export const getDataObject = async (key: string, data: any[], setData: any) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? setData([...data, JSON.parse(jsonValue)]) : null;
  } catch (e) {
    console.error('Error returning data object in AsyncStorage, error: ' + e);
  }
};

export const getDataObjects = async (keys, data, setData) => {
  try {
    const values = await Promise.all(
      keys.map(key => AsyncStorage.getItem(key).then(data => JSON.parse(data))),
    );

    if (data !== undefined) {
      let i = values.length;
      while (i--) {
        data.forEach(element => {
          if (values[i].name === element.name) {
            values.splice(i, 1);
          }
        });
      }
    }

    setData(prev => [...prev, ...values.filter(item => item !== null)]);
  } catch (e) {
    console.error('Error returning data objects in AsyncStorage, error: ' + e);
  }
};

export const getAllKeys = async (setAsyncStorageKeys: any) => {
  let keys: string[] = [];
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    console.error(
      'Error returning all data objects in AsyncStorage, error: ' + e,
    );
  }
  setAsyncStorageKeys(keys);
};
