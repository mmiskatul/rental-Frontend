import type { Car, CarType, FuelType, Transmission } from "@/lib/mock-data";
import { apiRequest } from "@/lib/api";

export type ApiCar = {
  id: string;
  owner_id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
  location: string;
  description?: string | null;
  seats?: number | null;
  transmission?: string | null;
  fuel_type?: string | null;
  image_url: string;
  image_public_id: string;
  created_at: string;
  updated_at: string;
};

export type CreateCarPayload = {
  title: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  image: File;
  description?: string;
  seats?: number;
  transmission?: string;
  fuelType?: string;
};

export type UpdateCarPayload = Omit<CreateCarPayload, "image"> & {
  image?: File | null;
};

export async function listCars() {
  const cars = await apiRequest<ApiCar[]>("/api/cars");
  return cars.map(mapApiCarToCar);
}

export async function getCarById(id: string) {
  const car = await apiRequest<ApiCar>(`/api/cars/${id}`);
  return mapApiCarToCar(car);
}

export async function createCar(payload: CreateCarPayload) {
  const formData = buildCarFormData(payload);
  const car = await apiRequest<ApiCar>("/api/cars", {
    method: "POST",
    body: formData,
  });
  return mapApiCarToCar(car);
}

export async function updateCar(id: string, payload: UpdateCarPayload) {
  const formData = buildCarFormData(payload);
  const car = await apiRequest<ApiCar>(`/api/cars/${id}`, {
    method: "PATCH",
    body: formData,
  });
  return mapApiCarToCar(car);
}

export async function deleteCar(id: string) {
  return apiRequest<{ message: string }>(`/api/cars/${id}`, { method: "DELETE" });
}

function buildCarFormData(payload: UpdateCarPayload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("brand", payload.brand);
  formData.append("model", payload.model);
  formData.append("year", String(payload.year));
  formData.append("price_per_day", String(payload.pricePerDay));
  formData.append("location", payload.location);
  if (payload.image) formData.append("image", payload.image);

  if (payload.description) formData.append("description", payload.description);
  if (payload.seats) formData.append("seats", String(payload.seats));
  if (payload.transmission) formData.append("transmission", payload.transmission);
  if (payload.fuelType) formData.append("fuel_type", payload.fuelType);

  return formData;
}

export function mapApiCarToCar(car: ApiCar): Car {
  const transmission = normalizeTransmission(car.transmission);
  const fuel = normalizeFuel(car.fuel_type);
  const type = inferCarType(car);
  const pricePerWeek = Math.round(car.price_per_day * 6);
  const image = car.image_url;

  return {
    id: car.id,
    name: car.title,
    brand: car.brand,
    model: car.model,
    year: car.year,
    type,
    pricePerDay: car.price_per_day,
    pricePerWeek,
    deposit: Math.max(300, Math.round(car.price_per_day * 5)),
    transmission,
    fuel,
    seats: car.seats ?? 5,
    luggage: 3,
    mileage: "Available on request",
    color: "Available on request",
    registration: car.id.slice(-8).toUpperCase(),
    location: car.location,
    pickupPoint: car.location,
    available: true,
    rating: 4.8,
    reviews: 0,
    image,
    gallery: [image],
    features: [transmission, fuel, `${car.seats ?? 5} seats`],
    description: car.description || `${car.title} is available to rent in ${car.location}.`,
  };
}

function normalizeTransmission(value?: string | null): Transmission {
  return value?.toLowerCase() === "manual" ? "Manual" : "Automatic";
}

function normalizeFuel(value?: string | null): FuelType {
  const normalized = value?.toLowerCase();
  if (normalized === "diesel") return "Diesel";
  if (normalized === "electric") return "Electric";
  if (normalized === "hybrid") return "Hybrid";
  return "Petrol";
}

function inferCarType(car: ApiCar): CarType {
  const value = `${car.title} ${car.model}`.toLowerCase();
  if (value.includes("suv") || value.includes("x5") || value.includes("rav4")) return "SUV";
  if (value.includes("tesla") || car.fuel_type?.toLowerCase() === "electric") return "Electric";
  if (value.includes("porsche") || value.includes("sport")) return "Sports";
  if (value.includes("luxury") || value.includes("class")) return "Luxury";
  if (value.includes("civic") || value.includes("compact")) return "Compact";
  return "Sedan";
}
