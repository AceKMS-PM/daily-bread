import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function AdminGuard() {
  const user = useQuery(api.users.getCurrentUser);

  // Encore en train de charger
  if (user === undefined) return <LoadingScreen />;

  // Pas connecté ou pas admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}