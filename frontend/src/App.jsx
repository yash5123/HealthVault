import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Overview from "./pages/Overview";
import Documents from "./pages/Documents";
import Medicines from "./pages/Medicines";
import LowStock from "./pages/LowStock";
import Checkups from "./pages/Checkups";
import FindHospitals from "./pages/FindHospitals";



import Auth from "./pages/auth/Auth";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        <Route path="/hospitals" element={
          <ProtectedRoute><FindHospitals /></ProtectedRoute>
        } />

        <Route path="/" element={
          <ProtectedRoute><Overview /></ProtectedRoute>
        } />

        <Route path="/documents" element={
          <ProtectedRoute><Documents /></ProtectedRoute>
        } />

        <Route path="/medicines" element={
          <ProtectedRoute><Medicines /></ProtectedRoute>
        } />

        <Route path="/lowstock" element={<LowStock />} />

        <Route path="/checkups" element={
          <ProtectedRoute><Checkups /></ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;