import * as SecureStore from 'expo-secure-store';

export const USER_STORE_KEY = "user";

export async function setToken(token: string) {
  await SecureStore.setItemAsync(USER_STORE_KEY, token);
}

export async function clearToken() {
  return await SecureStore.deleteItemAsync(USER_STORE_KEY);
}

export async function getToken() {
  return await SecureStore.getItemAsync(USER_STORE_KEY);
}

export async function isLogged() {
  return !!(await getToken());
}
