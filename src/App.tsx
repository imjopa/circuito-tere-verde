import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AboutPage from "@/pages/AboutPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import ContactPage from "@/pages/ContactPage";
import EventsPage from "@/pages/EventsPage";
import HomePage from "@/pages/HomePage";
import MapsPage from "@/pages/MapsPage";
import SchedulePage from "@/pages/SchedulePage";
import TrailsPage from "@/pages/TrailsPage";
import WaterfallsPage from "@/pages/WaterfallsPage";
import { Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      {/* ── Área pública ── */}
      <Route path="/" element={<HomePage />} />
      <Route path="/trilhas" element={<TrailsPage />} />
      <Route path="/cachoeiras" element={<WaterfallsPage />} />
      <Route path="/eventos" element={<EventsPage />} />
      <Route path="/horarios" element={<SchedulePage />} />
      <Route path="/mapas" element={<MapsPage />} />
      <Route path="/contato" element={<ContactPage />} />
      <Route path="/sobre" element={<AboutPage />} />

      {/* ── Área administrativa ── */}
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
