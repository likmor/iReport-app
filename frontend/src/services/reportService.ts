import { useQuery } from "@tanstack/react-query";
import api from "./api";
import type { Report } from "../types/report";

export const useMyReports = () =>
  useQuery<Report[]>({
    queryKey: ["my-reports"],
    queryFn: () => api.get("/api/reports/my").then((r) => r.data),
  });