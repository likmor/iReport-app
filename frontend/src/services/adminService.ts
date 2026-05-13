import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export const useAdminUsers = () =>
  useQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: () => api.get("/api/admin/users").then((r) => r.data),
  });

export const useChangeRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) =>
      api.patch(`/api/admin/users/${id}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });
};