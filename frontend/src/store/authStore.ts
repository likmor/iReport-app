import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  fullName: string;
  exp: number;
}

interface AuthState {
  isLoggedIn: boolean;
  role: string | null;
  fullName: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}


const token = localStorage.getItem("accessToken");
const decoded = token ? jwtDecode<JwtPayload>(token) : null;

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!token,
  role: decoded?.role ?? null,
  fullName: decoded?.fullName ?? null,

  login: (accessToken, refreshToken) => {
    const payload = jwtDecode<JwtPayload>(accessToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    set({
      isLoggedIn: true,
      role: payload.role,
      fullName: payload.fullName,
    });
  },

  logout: () => {
    localStorage.clear();
    set({ isLoggedIn: false, role: null, fullName: null });
  },
}));