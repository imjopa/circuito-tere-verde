import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AboutPage from "@/pages/AboutPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminEventsPage from "@/pages/admin/AdminEventsPage";
import AdminTrailsPage from "@/pages/admin/AdminTrailsPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import ContactPage from "@/pages/ContactPage";
import EventsPage from "@/pages/EventsPage";
import HomePage from "@/pages/HomePage";
import MapsPage from "@/pages/MapsPage";
import SchedulePage from "@/pages/SchedulePage";
import TrailsPage from "@/pages/TrailsPage";
import WaterfallsPage from "@/pages/WaterfallsPage";

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
        <Route path="/admin/trilhas" Component={AdminTrailsPage} />
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
