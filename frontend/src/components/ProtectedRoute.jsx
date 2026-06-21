import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ADMIN_URL } from "@/lib/firebase";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-navy-900">Loading…</div>;
  }
  if (!user) return <Navigate to={`${ADMIN_URL}/login`} replace />;
  return children;
}
