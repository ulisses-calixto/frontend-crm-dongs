import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import FirstSetup from "@/pages/FirstSetup";
import Dashboard from "@/pages/Dashboard";
import Donations from "@/pages/Donations";
import Beneficiaries from "@/pages/Beneficiaries";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Layout from "@/Layout";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center py-8">
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { signed, loading, user } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!signed) return <Navigate to="/auth/login" replace />;

  if (
    !user?.organization_id &&
    window.location.pathname !== "/cadastro-da-organizacao"
  ) {
    return <Navigate to="/cadastro-da-organizacao" replace />;
  }

  return children;
}
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/cadastro" element={<Register />} />

        <Route
          path="/cadastro-da-organizacao"
          element={
            <ProtectedRoute>
              <FirstSetup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/painel-de-controle"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doacoes"
          element={
            <ProtectedRoute>
              <Layout>
                <Donations />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/beneficiarios"
          element={
            <ProtectedRoute>
              <Layout>
                <Beneficiaries />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/relatorios"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracoes"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
