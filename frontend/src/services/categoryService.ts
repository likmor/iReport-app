import { useQuery } from "@tanstack/react-query";
import api from "./api";
import type { Category } from "@/types/report";


export const useCategories = () =>
  useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.get("/api/categories").then((r) => r.data),
  });