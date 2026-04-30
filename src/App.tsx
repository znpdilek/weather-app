import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { SignupPage } from "@/pages/signup";
import { HomePage } from "@/pages/home";
import { MapViewPage } from "@/pages/map-view";
import { ProtectedRoute } from "@/components/protected-route";
import { MainLayout } from "@/components/layout/main-layout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="map" element={<MapViewPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
