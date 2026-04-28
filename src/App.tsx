import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { SignupPage } from "@/pages/signup";
import { HomePage } from "@/pages/home";
import { ProtectedRoute } from "@/components/protected-route";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
