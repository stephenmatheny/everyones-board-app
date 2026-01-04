import { clearToken, setToken } from "../storage/token";
import { api } from "./client";

export async function registerUser({ first_name, last_name, email, password, phone_number }) {
  const res = await api.post("/auth/register", {
    first_name,
    last_name,
    email,
    password,
    phone_number: phone_number || null,
  });

  await setToken(res.data.token);
  return res.data.user;
}

export async function loginUser({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  await setToken(res.data.token);
  return res.data.user;
}

export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data.user;
}

export async function logoutUser() {
  try {
    await api.post("/auth/logout");
  } finally {
    await clearToken();
  }
}
