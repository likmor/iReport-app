import Layout from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute role="" />}>
        {/* <Route path="my-reports" element={<h1>SECRET</h1>} /> */}
      </Route>
    </Route>
  </Routes>
);
