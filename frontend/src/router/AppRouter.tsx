import Layout from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import MyReportsPage from "@/pages/MyReports";

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute roles={["User", "Admin"]} />}>
        <Route path="my-reports" element={<MyReportsPage />} />
      </Route>
    </Route>
  </Routes>
);
