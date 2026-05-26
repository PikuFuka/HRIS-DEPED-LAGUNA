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
import WorkflowView from "./pages/workflow/WorkflowView";
import Settings from "./pages/Settings";
import Vacancies from "./pages/Vacancies";
import Placeholder from "./pages/Placeholder";
import Records from "./pages/Records";
import Reports from "./pages/Reports";
import Registers from "./pages/Registers";
import Hierarchy from "./pages/Hierarchy";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLogs from "./pages/admin/AdminLogs";
import { Toaster } from "./components/ui/sonner";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Register />
            </motion.div>
          }
        />
        <Route path="/" element={<Shell />}>
          <Route
            index
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />
          <Route
            path="applications"
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />
          <Route
            path="applications/:id"
            element={
              <PageTransition>
                <WorkflowView />
              </PageTransition>
            }
          />

          {/* HRMO Routes */}
          <Route
            path="vacancies"
            element={
              <PageTransition>
                <Vacancies />
              </PageTransition>
            }
          />
          <Route
            path="appointments"
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />
          <Route
            path="reports"
            element={
              <PageTransition>
                <Reports />
              </PageTransition>
            }
          />

          {/* Records Routes */}
          <Route
            path="verification"
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />
          <Route
            path="records"
            element={
              <PageTransition>
                <Records />
              </PageTransition>
            }
          />

          {/* HRMPSB Routes */}
          <Route
            path="screening"
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />
          <Route
            path="evaluations"
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />
          <Route
            path="deliberations"
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />

          {/* Approver Routes */}
          <Route
            path="approvals"
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />

          {/* CSC Routes */}
          <Route
            path="csc-submissions"
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />
          <Route
            path="registers"
            element={
              <PageTransition>
                <Registers />
              </PageTransition>
            }
          />

          <Route
            path="hierarchy"
            element={
              <PageTransition>
                <Hierarchy />
              </PageTransition>
            }
          />

          {/* Super Admin Routes */}
          <Route
            path="admin/users"
            element={
              <PageTransition>
                <AdminUsers />
              </PageTransition>
            }
          />
          <Route
            path="admin/logs"
            element={
              <PageTransition>
                <AdminLogs />
              </PageTransition>
            }
          />

          <Route
            path="settings"
            element={
              <PageTransition>
                <Settings />
              </PageTransition>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
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
