import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import type { CreateReportRequest, Report } from "../types/report";

export const useMyReports = () =>
  useQuery<Report[]>({
    queryKey: ["my-reports"],
    queryFn: () => api.get("/api/reports/my").then((r) => r.data),
  });

export const useReports = () =>
  useQuery<Report[]>({
    queryKey: ["reports"],
    queryFn: () => api.get("/api/reports").then((r) => r.data),
  });

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReportRequest) =>
      api.post("/api/reports", data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["my-reports"] });
    },
  });
};