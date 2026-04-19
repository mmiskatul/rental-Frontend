import type { Booking, BookingStatus } from "@/lib/mock-data";
import { apiRequest } from "@/lib/api";

export type ApiBooking = {
  id: string;
  car_id: string;
  car_title: string;
  car_image_url?: string | null;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  start_date: string;
  end_date: string;
  days: number;
  pickup_location: string;
  total: number;
  status: BookingStatus;
  payment_status: "paid" | "pending" | "refunded";
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateBookingPayload = {
  carId: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  notes?: string;
};

export async function createBooking(payload: CreateBookingPayload) {
  const booking = await apiRequest<ApiBooking>("/api/bookings", {
    method: "POST",
    body: JSON.stringify({
      car_id: payload.carId,
      start_date: payload.startDate,
      end_date: payload.endDate,
      pickup_location: payload.pickupLocation,
      notes: payload.notes,
    }),
  });
  return mapApiBookingToBooking(booking);
}

export async function listBookings() {
  const bookings = await apiRequest<ApiBooking[]>("/api/bookings");
  return bookings.map(mapApiBookingToBooking);
}

export async function getBooking(id: string) {
  const booking = await apiRequest<ApiBooking>(`/api/bookings/${id}`);
  return mapApiBookingToBooking(booking);
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const booking = await apiRequest<ApiBooking>(`/api/bookings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return mapApiBookingToBooking(booking);
}

export async function requestPickup(id: string) {
  return postBookingAction(id, "request-pickup");
}

export async function confirmPickup(id: string) {
  return postBookingAction(id, "confirm-pickup");
}

export async function requestReturn(id: string) {
  return postBookingAction(id, "request-return");
}

export async function confirmReturn(id: string) {
  return postBookingAction(id, "confirm-return");
}

async function postBookingAction(id: string, action: string) {
  const booking = await apiRequest<ApiBooking>(`/api/bookings/${id}/${action}`, { method: "POST" });
  return mapApiBookingToBooking(booking);
}

export function mapApiBookingToBooking(booking: ApiBooking): Booking & { carName: string; carImage?: string | null } {
  return {
    id: booking.id,
    carId: booking.car_id,
    carName: booking.car_title,
    carImage: booking.car_image_url,
    customerName: booking.customer_name,
    customerEmail: booking.customer_email,
    customerPhone: booking.customer_phone ?? "",
    startDate: booking.start_date,
    endDate: booking.end_date,
    days: booking.days,
    pickupLocation: booking.pickup_location,
    total: booking.total,
    status: booking.status,
    createdAt: new Date(booking.created_at).toLocaleDateString(),
    notes: booking.notes ?? undefined,
    paymentStatus: booking.payment_status,
  };
}
