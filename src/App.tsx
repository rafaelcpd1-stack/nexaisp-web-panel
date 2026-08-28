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
      <Route path="/clientes" element={<CustomersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
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
