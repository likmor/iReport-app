import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  role: string | null;
  login: (accessToken: string, refreshToken: string, role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!localStorage.getItem("accessToken"),
  role: localStorage.getItem("role"),

  login: (accessToken, refreshToken, role) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);
    set({ isLoggedIn: true, role });
  },

  logout: () => {
    localStorage.clear();
    set({ isLoggedIn: false, role: null });
  },
}));
