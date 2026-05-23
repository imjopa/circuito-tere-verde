import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TrailsPage from "./pages/TrailsPage";
import WaterfallsPage from "./pages/WaterfallsPage";
import EventsPage from "./pages/EventsPage";
import SchedulePage from "./pages/SchedulePage";
import MapsPage from "./pages/MapsPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";

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
