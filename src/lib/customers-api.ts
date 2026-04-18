import type { Customer } from "@/lib/mock-data";
import { apiRequest } from "@/lib/api";

export type ApiCustomer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  joined_at: string;
  total_bookings: number;
  active_bookings: number;
  total_spend: number;
  status: "active" | "inactive";
};

export async function listCustomers() {
  const customers = await apiRequest<ApiCustomer[]>("/api/customers");
  return customers.map(mapApiCustomerToCustomer);
}

function mapApiCustomerToCustomer(customer: ApiCustomer): Customer {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone ?? "",
    joinedAt: new Date(customer.joined_at).toLocaleDateString(),
    totalBookings: customer.total_bookings,
    activeBookings: customer.active_bookings,
    totalSpend: customer.total_spend,
    status: customer.status,
  };
}
