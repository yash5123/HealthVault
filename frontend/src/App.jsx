import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { MedicineProvider } from "./context/MedicineContext";
import { DocumentsProvider } from "./context/DocumentsContext";

import "leaflet/dist/leaflet.css";
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

          <Suspense fallback={<PageLoader />}>

            <Routes>

              {/* ===== AUTH ROUTES ===== */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/register" element={<Auth />} />

              {/* ===== PROTECTED ROUTES ===== */}

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Overview />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Documents />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/medicines"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Medicines />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/checkups"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Checkups />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/lowstock"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <LowStock />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/hospitals"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <FindHospitals />
                    </Layout>
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