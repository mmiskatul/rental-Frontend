import { apiRequest } from "@/lib/api";
import { mapApiCarToCar, type ApiCar } from "@/lib/cars-api";

export async function listFavoriteCars() {
  const cars = await apiRequest<ApiCar[]>("/api/favorites");
  return cars.map(mapApiCarToCar);
}

export async function addFavoriteCar(carId: string) {
  const car = await apiRequest<ApiCar>(`/api/favorites/${carId}`, { method: "POST" });
  return mapApiCarToCar(car);
}

export async function removeFavoriteCar(carId: string) {
  return apiRequest<{ message: string }>(`/api/favorites/${carId}`, { method: "DELETE" });
}
