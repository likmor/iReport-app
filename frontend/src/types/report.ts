export interface Category {
  id: number;
  name: string;
  icon: string;
}
export type ReportStatus = "New" | "InProgress" | "Resolved" | "Rejected";

export interface Report {
  id: number;
  title: string;
  description: string;
  category: Category;
  status: ReportStatus;
  latitude: number;
  longitude: number;
  createdAt: string;
  removable: boolean;
}

export interface CreateReportRequest {
  title: string;
  description: string;
  categoryId: number;
  latitude: number;
  longitude: number;
}

export interface DeleteReportRequest {
  id: number;
}

export interface UpdateStatusReportRequest {
  id: number;
  newStatus: string;
}