import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Navigate, Outlet } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function AdminGuard() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser);

  if (isLoading || (isAuthenticated && user === undefined)) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/connexion" replace />;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}