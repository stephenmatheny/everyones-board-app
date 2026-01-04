import axios from "axios";
import { API_BASE_URL } from "../config";
import { getToken } from "../storage/token";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  config.headers = config.headers ?? {};
  config.headers.Accept = "application/json";

  // JSON posts
  if (!config.headers["Content-Type"] && ["post", "put", "patch"].includes((config.method || "").toLowerCase())) {
    config.headers["Content-Type"] = "application/json";
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
