import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Landing from "./Landing.jsx";
import Scorer from "./Scorer.jsx";

// Paystack redirects back to whatever URL was set as the callback. If that
// callback happens to be the root, forward the reference straight to /app
// so the payment gets verified.
function RootRoute() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  if (params.has("reference") || params.has("trxref")) {
    return <Navigate to={`/app${location.search}`} replace />;
  }
  return <Landing />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/app" element={<Scorer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
