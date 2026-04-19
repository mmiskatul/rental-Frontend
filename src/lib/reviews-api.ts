import { apiRequest } from "@/lib/api";

export type Review = {
  id: string;
  bookingId: string;
  carId: string;
  carTitle: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type ApiReview = {
  id: string;
  booking_id: string;
  car_id: string;
  car_title: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
};

export async function createReview(payload: { bookingId: string; rating: number; comment: string }) {
  const review = await apiRequest<ApiReview>("/api/reviews", {
    method: "POST",
    body: JSON.stringify({
      booking_id: payload.bookingId,
      rating: payload.rating,
      comment: payload.comment,
    }),
  });
  return mapApiReview(review);
}

export async function listReviews(params: { bookingId?: string; carId?: string } = {}) {
  const search = new URLSearchParams();
  if (params.bookingId) search.set("booking_id", params.bookingId);
  if (params.carId) search.set("car_id", params.carId);
  const suffix = search.toString() ? `?${search.toString()}` : "";
  const reviews = await apiRequest<ApiReview[]>(`/api/reviews${suffix}`);
  return reviews.map(mapApiReview);
}

function mapApiReview(review: ApiReview): Review {
  return {
    id: review.id,
    bookingId: review.booking_id,
    carId: review.car_id,
    carTitle: review.car_title,
    customerId: review.customer_id,
    customerName: review.customer_name,
    customerEmail: review.customer_email,
    rating: review.rating,
    comment: review.comment,
    createdAt: new Date(review.created_at).toLocaleDateString(),
  };
}
