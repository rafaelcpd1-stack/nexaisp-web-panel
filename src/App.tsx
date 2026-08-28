import { lazy, Suspense } from "react";
import {
  Navigate,
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./auth/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
const CustomersPage = lazy(() => import("./pages/CustomersPage"));
const ModulePlaceholderPage = lazy(() => import("./pages/ModulePlaceholderPage"));

function ProtectedRoute() {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f4f7fb",
          color: "#5f6d84",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        Carregando NexaISP...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardPage />;
}

function RouteLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f5f7fb",
        color: "#68738a",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      Carregando NexaISP...
    </div>
  );
}

function ApplicationRoutes() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<ProtectedRoute />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/clientes" element={<CustomersPage />} />

          <Route path="/contratos" element={<ModulePlaceholderPage />} />
          <Route path="/planos" element={<ModulePlaceholderPage />} />
          <Route path="/financeiro" element={<ModulePlaceholderPage />} />
          <Route path="/atendimentos" element={<ModulePlaceholderPage />} />
          <Route
            path="/ordens-servico"
            element={<ModulePlaceholderPage />}
          />

          <Route
            path="/dispositivos"
            element={<ModulePlaceholderPage />}
          />
          <Route path="/olt-onu" element={<ModulePlaceholderPage />} />
          <Route path="/radius" element={<ModulePlaceholderPage />} />
          <Route path="/ipam" element={<ModulePlaceholderPage />} />
          <Route
            path="/monitoramento"
            element={<ModulePlaceholderPage />}
          />

          <Route path="/estoque" element={<ModulePlaceholderPage />} />
          <Route path="/fiscal" element={<ModulePlaceholderPage />} />
          <Route path="/relatorios" element={<ModulePlaceholderPage />} />
          <Route
            path="/configuracoes"
            element={<ModulePlaceholderPage />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ApplicationRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
