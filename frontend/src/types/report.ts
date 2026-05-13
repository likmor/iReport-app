export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Report {
  id: number;
  title: string;
  description: string;
  category: Category;
  status: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface CreateReportRequest {
  title: string;
  description: string;
  categoryId: number;
  latitude: number;
  longitude: number;
}
