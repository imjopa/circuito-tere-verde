import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "@/components/admin/ProtectedRoute";

import RootLayout from "./components/layout/RootLayout";

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

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "/trilhas",
        Component: TrailsPage,
      },
      {
        path: "/cachoeiras",
        Component: WaterfallsPage,
      },
      {
        path: "/eventos",
        Component: EventsPage,
      },
      {
        path: "/horarios",
        Component: SchedulePage,
      },
      {
        path: "/mapas",
        Component: MapsPage,
      },
      {
        path: "/contato",
        Component: ContactPage,
      },
      {
        path: "/sobre",
        Component: AboutPage,
      },
      {
        path: "/admin",
        Component: AdminLoginPage,
      },
      {
        path: "/admin",
        Component: PrivateLayout,
        children: [
          {
            path: "/admin/dashboard",
            Component: AdminDashboardPage,
          },
          {
            path: "/admin/parques",
            Component: AdminParksPage,
          },
          {
            path: "/admin/trilhas",
            Component: AdminTrailsPage,
          },
          {
            path: "/admin/cachoeiras",
            Component: AdminWaterfallsPage,
          },
          {
            path: "/admin/eventos",
            Component: AdminEventsPage,
          },
        ],
      },
      {
        path: "*",
        Component: RedirectToHome,
      },
    ],
  },
]);

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
