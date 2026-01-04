import * as SecureStore from "expo-secure-store";

const KEY = "auth_token";

export function getToken() {
  return SecureStore.getItemAsync(KEY);
}

export function setToken(token) {
  return SecureStore.setItemAsync(KEY, token);
}

export function clearToken() {
  return SecureStore.deleteItemAsync(KEY);
}
