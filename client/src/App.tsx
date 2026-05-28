/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { AnimatePresence, motion } from "motion/react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shell from "./components/layout/Shell";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import WorkflowView from "./pages/workflow/WorkflowView";
import Settings from "./pages/Settings";
import Vacancies from "./pages/Vacancies";
import Placeholder from "./pages/Placeholder";
import Records from "./pages/Records";
import Reports from "./pages/Reports";
import Registers from "./pages/Registers";
import Deliberations from "./pages/Deliberations";
import Appointments from "./pages/Appointments";
import CscSubmissions from "./pages/CscSubmissions";
import Hierarchy from "./pages/Hierarchy";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLogs from "./pages/admin/AdminLogs";
import { Toaster } from "./components/ui/sonner";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Shell />}>
          <Route index element={<Dashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="applications/:id" element={<WorkflowView />} />

          {/* HRMO Routes */}
          <Route path="vacancies" element={<Vacancies />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="reports" element={<Reports />} />

          {/* Records Routes */}
          <Route path="verification" element={<Dashboard />} />
          <Route path="records" element={<Records />} />

          {/* HRMPSB Routes */}
          <Route path="screening" element={<Dashboard />} />
          <Route path="evaluations" element={<Dashboard />} />
          <Route path="deliberations" element={<Deliberations />} />

          {/* Approver Routes */}
          <Route path="approvals" element={<Dashboard />} />

          {/* CSC Routes */}
          <Route path="csc-submissions" element={<CscSubmissions />} />
          <Route path="registers" element={<Registers />} />

          <Route path="hierarchy" element={<Hierarchy />} />

          {/* Super Admin Routes */}
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/logs" element={<AdminLogs />} />

          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      {children}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}
