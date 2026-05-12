import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";
import api from "./api";

export const useLogin = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (data) =>
      api.post<AuthResponse>("/api/auth/login", data).then((r) => r.data),

    onSuccess: (data) => {
      login(data.accessToken, data.refreshToken);
      navigate("/");
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (data) =>
      api.post<AuthResponse>("/api/auth/register", data).then((r) => r.data),

    onSuccess: () => navigate("/login"),
  });
};