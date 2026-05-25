import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/components/admin/ProtectedRoute";

const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const AdminEventsPage = lazy(() => import("@/pages/admin/AdminEventsPage"));
const AdminParksPage = lazy(() => import("@/pages/admin/AdminParksPage"));
const AdminTrailsPage = lazy(() => import("@/pages/admin/AdminTrailsPage"));
const AdminWaterfallsPage = lazy(() => import("@/pages/admin/AdminWaterfallsPage"));
const AdminLoginPage = lazy(() => import("@/pages/AdminLoginPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const EventsPage = lazy(() => import("@/pages/EventsPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const MapsPage = lazy(() => import("@/pages/MapsPage"));
const SchedulePage = lazy(() => import("@/pages/SchedulePage"));
const TrailsPage = lazy(() => import("@/pages/TrailsPage"));
const WaterfallsPage = lazy(() => import("@/pages/WaterfallsPage"));

export default function App() {
  return (
    <Routes>
      {/* ── Área pública ── */}
      <Route path="/" Component={HomePage} />
      <Route path="/trilhas" Component={TrailsPage} />
      <Route path="/cachoeiras" Component={WaterfallsPage} />
      <Route path="/eventos" Component={EventsPage} />
      <Route path="/horarios" Component={SchedulePage} />
      <Route path="/mapas" Component={MapsPage} />
      <Route path="/contato" Component={ContactPage} />
      <Route path="/sobre" Component={AboutPage} />

      {/* ── Área administrativa ── */}
      <Route path="/admin" Component={AdminLoginPage} />
      <Route Component={PrivateLayout}>
        <Route path="/admin/dashboard" Component={AdminDashboardPage} />
        <Route path="/admin/parques" Component={AdminParksPage} />
        <Route path="/admin/trilhas" Component={AdminTrailsPage} />
        <Route path="/admin/cachoeiras" Component={AdminWaterfallsPage} />
        <Route path="/admin/eventos" Component={AdminEventsPage} />
      </Route>

      {/* ── Fallback ── */}
      <Route path="*" Component={RedirectToHome} />
    </Routes>
  );
}

function PrivateLayout() {
  return (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  );
}

function RedirectToHome() {
  return <Navigate to="/" replace />;
}
