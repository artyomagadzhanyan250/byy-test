import { Routes, Route, Navigate } from "react-router-dom";

import SignInForm from "./components/auth/SignInForm";

import SignUpForm from "./components/auth/SignUpForm";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="/login"
        element={<SignInForm />}
      />

      <Route
        path="/register"
        element={<SignUpForm />}
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default App;
