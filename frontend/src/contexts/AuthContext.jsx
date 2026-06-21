import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [fbUser, setFbUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null); // MongoDB profile (role, name, etc.)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseAuth) {
      setLoading(false);
      return undefined;
    }

    const unsub = onAuthStateChanged(firebaseAuth, async (u) => {
      setFbUser(u);
      if (!u) {
        setAdminUser(null);
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setAdminUser(data);
      } catch (err) {
        // signed-in Firebase user without admin role — sign them out
        setAdminUser(null);
        try { await signOut(firebaseAuth); } catch {}
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const login = async (email, password) => {
    if (!firebaseAuth) {
      throw new Error("Firebase is not configured. Add frontend/.env values to enable admin login.");
    }
    const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
    try {
      const { data } = await api.get("/auth/me");
      setAdminUser(data);
      return data;
    } catch (err) {
      setAdminUser(null);
      try { await signOut(firebaseAuth); } catch {}

      if (!err.response) {
        throw new Error("Admin API is unavailable. Make sure the backend and MongoDB are running.");
      }
      if (err.response.status === 403) {
        throw new Error(err.response.data?.detail || "This Firebase account does not have admin access.");
      }
      if (err.response.status === 401) {
        throw new Error("The backend could not verify the Firebase login. Check the backend Firebase configuration.");
      }
      throw new Error(err.response.data?.detail || "Admin access could not be verified.");
    }
  };

  const logout = async () => {
    if (!firebaseAuth) return;
    await signOut(firebaseAuth);
  };

  return (
    <AuthContext.Provider value={{ fbUser, user: adminUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
