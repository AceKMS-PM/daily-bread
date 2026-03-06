import { Routes, Route, Navigate } from "react-router-dom";
import { Authenticated, AuthLoading, useConvexAuth } from "convex/react";
import Layout from "@/components/layout/Layout";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminGuard from "@/components/layout/AdminGuard";
import HomePage from "@/pages/HomePage";
import DevotionalPage from "@/pages/DevotionalPage";
import ArchivePage from "@/pages/ArchivePage";
import PrayerWallPage from "@/pages/PrayerWallPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminDevotionals from "@/pages/admin/AdminDevotionals";
import AdminDevotionalEditor from "@/pages/admin/AdminDevotionalEditor";
import AdminUsers from "@/pages/admin/AdminUsers";
import SignInPage from "@/pages/SignInPage";
import LoadingScreen from "@/components/ui/LoadingScreen";
import NotFoundPage from "@/pages/NotFoundPage";

function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <AuthLoading>
        <LoadingScreen />
      </AuthLoading>

      <Routes>
        {/* Routes publiques */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/devotional/:date" element={<DevotionalPage />} />
          <Route path="/archives" element={<ArchivePage />} />
          <Route path="/mur-de-priere" element={<PrayerWallPage />} />
          <Route
            path="/connexion"
            element={
              <RedirectIfAuthenticated>
                <SignInPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Routes admin — double protection : auth + rôle admin */}
        <Route
          path="/admin"
          element={
            <Authenticated fallback={<Navigate to="/connexion" replace />}>
              <AdminGuard />
            </Authenticated>
          }
        >
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="devotionals" element={<AdminDevotionals />} />
            <Route path="devotionals/new" element={<AdminDevotionalEditor />} />
            <Route path="devotionals/:id/edit" element={<AdminDevotionalEditor />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}