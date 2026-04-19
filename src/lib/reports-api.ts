import { apiRequest } from "@/lib/api";
import type { OverviewTrendPoint } from "@/lib/overview-api";

export type StatusDistributionPoint = {
  name: string;
  value: number;
};

export type TopCarPoint = {
  name: string;
  bookings: number;
  revenue: number;
  utilization: number;
};

export type AdminReports = {
  totalRevenue: number;
  totalBookings: number;
  averageBooking: number;
  averageRating: number;
  revenueTrend: OverviewTrendPoint[];
  statusDistribution: StatusDistributionPoint[];
  topCars: TopCarPoint[];
};

type ApiAdminReports = {
  total_revenue: number;
  total_bookings: number;
  average_booking: number;
  average_rating: number;
  revenue_trend: OverviewTrendPoint[];
  status_distribution: StatusDistributionPoint[];
  top_cars: TopCarPoint[];
};

export async function getAdminReports() {
  const reports = await apiRequest<ApiAdminReports>("/api/admin/reports");
  return {
    totalRevenue: reports.total_revenue,
    totalBookings: reports.total_bookings,
    averageBooking: reports.average_booking,
    averageRating: reports.average_rating,
    revenueTrend: reports.revenue_trend,
    statusDistribution: reports.status_distribution,
    topCars: reports.top_cars,
  };
}
