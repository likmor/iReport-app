import type { ReportStatus } from "@/types/report";

export const STATUS_COLORS: Record<ReportStatus, string> = {
  New: "blue",
  InProgress: "yellow",
  Resolved: "green",
  Rejected: "red",
};