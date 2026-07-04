import axios from "axios";
import { firebaseAuth } from "@/lib/firebase";

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
export const API = BACKEND_URL ? `${BACKEND_URL}/api` : "/api";
export const BACKEND_ORIGIN = BACKEND_URL;

export const api = axios.create({
  baseURL: API,
  timeout: 20000,
});

// Attach Firebase ID token to every request when a user is signed in.
api.interceptors.request.use(async (config) => {
  const user = firebaseAuth?.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken(/* forceRefresh */ false);
      config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore — backend will return 401 and AuthContext will sign out
    }
  }
  return config;
});
