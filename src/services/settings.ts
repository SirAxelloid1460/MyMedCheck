import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY_STORAGE = 'mymedcheck.anthropicApiKey';

/** Lee la clave de API de Claude guardada por el usuario (o cadena vacía). */
export async function getApiKey(): Promise<string> {
  try {
    return (await AsyncStorage.getItem(API_KEY_STORAGE)) ?? '';
  } catch {
    return '';
  }
}

/** Guarda (o borra, si es vacía) la clave de API de Claude. */
export async function setApiKey(key: string): Promise<void> {
  const trimmed = key.trim();
  if (trimmed) {
    await AsyncStorage.setItem(API_KEY_STORAGE, trimmed);
  } else {
    await AsyncStorage.removeItem(API_KEY_STORAGE);
  }
}
