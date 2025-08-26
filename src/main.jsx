import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RoleLanding from "./pages/RoleLanding.jsx";
import Login from "./pages/login.jsx";
import OpticDashboard from "./pages/optic/OpticDashboard.jsx";
import LabDashboard from "./pages/lab/LabDashboard.jsx";
import CustomerApp from "./pages/customer/CustomerApp.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

import "./index.css";

function RequireRole({ allow, children }) {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const hasRole = Array.isArray(allow) && auth?.role && allow.includes(auth.role);
  return hasRole ? children : <Navigate to="/" />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleLanding />} />
        <Route path="/login/:role" element={<Login />} />

        <Route
          path="/optic"
          element={
            <RequireRole allow={["OPTIC"]}>
              <OpticDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/lab"
          element={
            <RequireRole allow={["LAB"]}>
              <LabDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/app"
          element={
            <RequireRole allow={["CUSTOMER"]}>
              <CustomerApp />
            </RequireRole>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireRole allow={["ADMIN"]}>
              <AdminDashboard />
            </RequireRole>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

