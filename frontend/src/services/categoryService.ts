import { useQuery } from "@tanstack/react-query";
import api from "./api";

export interface Category { id: number; name: string; }

export const useCategories = () =>
  useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.get("/api/categories").then((r) => r.data),
  });