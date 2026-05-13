import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import type { CreateReportRequest, DeleteReportRequest, Report } from "../types/report";

export const useMyReports = () =>
  useQuery<Report[]>({
    queryKey: ["my-reports"],
    queryFn: () => api.get("/api/reports/my").then((r) => r.data),
    refetchInterval: 10000,
  });

export const useReports = () =>
  useQuery<Report[]>({
    queryKey: ["reports"],
    queryFn: () => api.get("/api/reports").then((r) => r.data),
    refetchInterval: 10000,
  });

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReportRequest) => api.post("/api/reports", data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["my-reports"] });
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteReportRequest) =>
      api
        .delete("/api/reports", {
          data,
        })
        .then((r) => r.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["my-reports"] });
    },
  });
};
