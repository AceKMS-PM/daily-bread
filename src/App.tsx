import { Routes, Route } from "react-router-dom";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import DevotionalPage from "@/pages/DevotionalPage";
import ArchivePage from "@/pages/ArchivePage";
import PrayerWallPage from "@/pages/PrayerWallPage";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminDevotionals from "@/pages/admin/AdminDevotionals";
import AdminDevotionalEditor from "@/pages/admin/AdminDevotionalEditor";
import AdminUsers from "@/pages/admin/AdminUsers";
import SignInPage from "@/pages/SignInPage";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function App() {
  return (
    <>
      <AuthLoading>
        <LoadingScreen />
      </AuthLoading>

      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/devotional/:date" element={<DevotionalPage />} />
          <Route path="/archives" element={<ArchivePage />} />
          <Route path="/mur-de-priere" element={<PrayerWallPage />} />
          <Route path="/connexion" element={<SignInPage />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <Authenticated>
              <AdminLayout />
            </Authenticated>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="devotionals" element={<AdminDevotionals />} />
          <Route path="devotionals/new" element={<AdminDevotionalEditor />} />
          <Route path="devotionals/:id/edit" element={<AdminDevotionalEditor />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </>
  );
}
