import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import ProtectedRoute from "./components/ProtectedRoute";
import { MedicineProvider } from "./context/MedicineContext";
import { DocumentsProvider } from "./context/DocumentsContext";

import "./styles/base.css";
import "./styles/variables.css";
import "./styles/layout.css";
import "./styles/components.css";

const Overview = lazy(() => import("./pages/Overview"));
const Documents = lazy(() => import("./pages/Documents"));
const Medicines = lazy(() => import("./pages/Medicines"));
const LowStock = lazy(() => import("./pages/LowStock"));
const Checkups = lazy(() => import("./pages/Checkups"));
const FindHospitals = lazy(() => import("./pages/FindHospitals"));
const Auth = lazy(() => import("./pages/auth/Auth"));

function PageLoader() {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MedicineProvider>
        <DocumentsProvider>

          {/* Floating Orbs */}
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>

          {/* Subtle Particles */}
          <div className="particle" style={{ left: "20%" }}></div>
          <div className="particle" style={{ left: "50%" }}></div>
          <div className="particle" style={{ left: "80%" }}></div>

          <Suspense fallback={<PageLoader />}>

            <Routes>

              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/register" element={<Auth />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Overview />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <Documents />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/medicines"
                element={
                  <ProtectedRoute>
                    <Medicines />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/checkups"
                element={
                  <ProtectedRoute>
                    <Checkups />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/hospitals"
                element={
                  <ProtectedRoute>
                    <FindHospitals />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/lowstock"
                element={
                  <ProtectedRoute>
                    <LowStock />
                  </ProtectedRoute>
                }
              />

            </Routes>

          </Suspense>

        </DocumentsProvider>
      </MedicineProvider>
    </BrowserRouter>
  );
}

export default App;