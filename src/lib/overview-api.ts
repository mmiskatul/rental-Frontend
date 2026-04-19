import { apiRequest } from "@/lib/api";

export type OverviewTrendPoint = {
  month: string;
  revenue: number;
  bookings: number;
};

export type OverviewFleetPoint = {
  name: string;
  value: number;
};

export type AdminOverview = {
  totalCars: number;
  availableCars: number;
  bookedCars: number;
  totalCustomers: number;
  totalBookings: number;
  activeBookings: number;
  pendingRequests: number;
  monthlyRevenue: number;
  fleetUtilization: number;
  revenueTrend: OverviewTrendPoint[];
  fleetDistribution: OverviewFleetPoint[];
};

type ApiAdminOverview = {
  total_cars: number;
  available_cars: number;
  booked_cars: number;
  total_customers: number;
  total_bookings: number;
  active_bookings: number;
  pending_requests: number;
  monthly_revenue: number;
  fleet_utilization: number;
  revenue_trend: OverviewTrendPoint[];
  fleet_distribution: OverviewFleetPoint[];
};

export async function getAdminOverview() {
  const overview = await apiRequest<ApiAdminOverview>("/api/admin/overview");
  return {
    totalCars: overview.total_cars,
    availableCars: overview.available_cars,
    bookedCars: overview.booked_cars,
    totalCustomers: overview.total_customers,
    totalBookings: overview.total_bookings,
    activeBookings: overview.active_bookings,
    pendingRequests: overview.pending_requests,
    monthlyRevenue: overview.monthly_revenue,
    fleetUtilization: overview.fleet_utilization,
    revenueTrend: overview.revenue_trend,
    fleetDistribution: overview.fleet_distribution,
  };
}
