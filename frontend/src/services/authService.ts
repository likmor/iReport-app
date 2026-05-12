import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "./api";

export const useLogin = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post("/api/auth/login", data).then((r) => r.data),

    onSuccess: (data) => {
      login(data.accessToken, data.refreshToken, data.role);
      navigate("/");
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { fullName: string; email: string; password: string }) =>
      api.post("/api/auth/register", data).then((r) => r.data),

    onSuccess: () => navigate("/login"),
  });
};
