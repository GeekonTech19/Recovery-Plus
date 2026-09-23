
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";

import Dashboard from "../pages/Dashboard";
import DailyCheckIn from "../pages/DailyCheckIn";
import AIAssistant from "../pages/AIAssistant";
import Goals from "../pages/Goals";
import Community from "../pages/Community";
import Achievements from "../pages/Achievements";

import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";

import AdminLayout from "../components/admin/AdminLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminActivity from "../pages/admin/AdminActivity";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
import AdminCommunity from "../pages/admin/AdminCommunity";
import AdminAchievements from "../pages/admin/AdminAchievements";
import AdminSettings from "../pages/admin/AdminSettings";

import AdminUsers from "../components/admin/AdminUsers";
import AdminUserOverview from "../components/admin/AdminUserOverview";

import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC AREA
        ========================= */}

        <Route
          path="/"
          element={<Welcome />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            RECOVERY+ USER AREA
        ========================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/daily-checkin"
            element={<DailyCheckIn />}
          />

          <Route
            path="/ai-assistant"
            element={<AIAssistant />}
          />

          <Route
            path="/goals"
            element={<Goals />}
          />

          <Route
            path="/community"
            element={<Community />}
          />

          <Route
            path="/achievements"
            element={<Achievements />}
          />

        </Route>


        {/* =========================
            ADMIN AREA
        ========================= */}

        <Route element={<AdminProtectedRoute />}>

          {/* Dashboard */}

          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />


          {/* Users */}

          <Route
            path="/admin/users"
            element={
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            }
          />


          {/* User Overview */}

          <Route
            path="/admin/users/:id"
            element={
              <AdminLayout>
                <AdminUserOverview />
              </AdminLayout>
            }
          />


          {/* Activity */}

          <Route
            path="/admin/activity"
            element={
              <AdminLayout>
                <AdminActivity />
              </AdminLayout>
            }
          />


          {/* Analytics */}

          <Route
            path="/admin/analytics"
            element={
              <AdminLayout>
                <AdminAnalytics />
              </AdminLayout>
            }
          />


          {/* Community */}

          <Route
            path="/admin/community"
            element={
              <AdminLayout>
                <AdminCommunity />
              </AdminLayout>
            }
          />


          {/* Achievements */}

          <Route
            path="/admin/achievements"
            element={
              <AdminLayout>
                <AdminAchievements />
              </AdminLayout>
            }
          />


          {/* Settings / Super Admin Control Center */}

          <Route
            path="/admin/settings"
            element={
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            }
          />

        </Route>


        {/* =========================
            UNKNOWN ROUTES
        ========================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
<Route
  path="/reset-password"
  element={<ResetPassword />}
/>
</Routes>
    </BrowserRouter>
  );
}
