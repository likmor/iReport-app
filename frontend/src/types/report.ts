export interface Report {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "New" | "InProgress" | "Resolved" | "Rejected";
  lat: number;
  lng: number;
  createdAt: string;
}