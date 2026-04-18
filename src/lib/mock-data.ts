import carSuv from "@/assets/car-suv.jpg";
import carSedan from "@/assets/car-sedan.jpg";
import carSports from "@/assets/car-sports.jpg";
import carCompact from "@/assets/car-compact.jpg";
import carEv from "@/assets/car-ev.jpg";
import carLuxurySuv from "@/assets/car-luxury-suv.jpg";

export type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "completed"
  | "cancelled";

export type CarType = "Sedan" | "SUV" | "Sports" | "Compact" | "Electric" | "Luxury";
export type FuelType = "Petrol" | "Diesel" | "Electric" | "Hybrid";
export type Transmission = "Automatic" | "Manual";

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: CarType;
  pricePerDay: number;
  pricePerWeek: number;
  deposit: number;
  transmission: Transmission;
  fuel: FuelType;
  seats: number;
  luggage: number;
  mileage: string;
  color: string;
  registration: string;
  location: string;
  pickupPoint: string;
  available: boolean;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  features: string[];
  description: string;
}

export const cars: Car[] = [
  {
    id: "DF-001",
    name: "Mercedes S-Class",
    brand: "Mercedes",
    model: "S-Class",
    year: 2024,
    type: "Luxury",
    pricePerDay: 285,
    pricePerWeek: 1750,
    deposit: 1500,
    transmission: "Automatic",
    fuel: "Hybrid",
    seats: 5,
    luggage: 3,
    mileage: "8,420 km",
    color: "Midnight Blue",
    registration: "DF-MB-2401",
    location: "New York",
    pickupPoint: "Manhattan Downtown",
    available: true,
    rating: 4.9,
    reviews: 128,
    image: carSedan,
    gallery: [carSedan, carLuxurySuv, carSuv],
    features: ["Leather Seats", "Panoramic Roof", "Adaptive Cruise", "360° Camera", "Heated Seats", "Premium Sound"],
    description:
      "Experience the pinnacle of luxury with the Mercedes S-Class. Designed for discerning travelers, this flagship sedan combines effortless performance with a serenely quiet cabin and the latest driver-assistance technology.",
  },
  {
    id: "DF-002",
    name: "BMW X5 xDrive",
    brand: "BMW",
    model: "X5",
    year: 2024,
    type: "SUV",
    pricePerDay: 195,
    pricePerWeek: 1180,
    deposit: 1200,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 7,
    luggage: 4,
    mileage: "12,150 km",
    color: "Black Sapphire",
    registration: "DF-BMW-2402",
    location: "Los Angeles",
    pickupPoint: "LAX Airport Terminal 4",
    available: true,
    rating: 4.8,
    reviews: 96,
    image: carLuxurySuv,
    gallery: [carLuxurySuv, carSuv, carSedan],
    features: ["AWD", "Apple CarPlay", "Wireless Charging", "Sport Mode", "Tow Hitch", "Sunroof"],
    description:
      "The BMW X5 delivers a perfect balance of athletic performance and family practicality. Spacious for seven, agile on the road, and equipped with intuitive iDrive technology.",
  },
  {
    id: "DF-003",
    name: "Toyota RAV4 Hybrid",
    brand: "Toyota",
    model: "RAV4 Hybrid",
    year: 2024,
    type: "SUV",
    pricePerDay: 89,
    pricePerWeek: 540,
    deposit: 600,
    transmission: "Automatic",
    fuel: "Hybrid",
    seats: 5,
    luggage: 3,
    mileage: "6,800 km",
    color: "Pearl White",
    registration: "DF-TOY-2403",
    location: "Chicago",
    pickupPoint: "O'Hare Rental Center",
    available: true,
    rating: 4.7,
    reviews: 215,
    image: carSuv,
    gallery: [carSuv, carEv, carCompact],
    features: ["Hybrid Engine", "Lane Assist", "Apple CarPlay", "All-Wheel Drive", "Adaptive Cruise"],
    description:
      "Reliable, efficient, and effortlessly capable. The RAV4 Hybrid is the smart choice for road trips, daily commutes, and weekend escapes alike.",
  },
  {
    id: "DF-004",
    name: "Tesla Model Y",
    brand: "Tesla",
    model: "Model Y Long Range",
    year: 2024,
    type: "Electric",
    pricePerDay: 145,
    pricePerWeek: 875,
    deposit: 1000,
    transmission: "Automatic",
    fuel: "Electric",
    seats: 5,
    luggage: 3,
    mileage: "4,250 km",
    color: "Pearl White Multi-Coat",
    registration: "DF-TSL-2404",
    location: "San Francisco",
    pickupPoint: "SFO Airport",
    available: true,
    rating: 4.9,
    reviews: 342,
    image: carEv,
    gallery: [carEv, carSuv, carLuxurySuv],
    features: ["Autopilot", "330 mi Range", "Glass Roof", "15\" Touchscreen", "Supercharger Access"],
    description:
      "Glide silently into the future. The Tesla Model Y Long Range offers exhilarating acceleration, cutting-edge tech, and zero emissions.",
  },
  {
    id: "DF-005",
    name: "Honda Civic Sport",
    brand: "Honda",
    model: "Civic",
    year: 2024,
    type: "Compact",
    pricePerDay: 55,
    pricePerWeek: 330,
    deposit: 400,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    luggage: 2,
    mileage: "9,640 km",
    color: "Sonic Gray",
    registration: "DF-HON-2405",
    location: "Miami",
    pickupPoint: "MIA Airport",
    available: false,
    rating: 4.6,
    reviews: 178,
    image: carCompact,
    gallery: [carCompact, carSports, carSedan],
    features: ["Bluetooth", "Backup Camera", "Lane Watch", "Eco Mode", "USB-C"],
    description:
      "City-friendly, fuel-efficient, and surprisingly fun to drive. The Civic Sport is the everyday companion you can always rely on.",
  },
  {
    id: "DF-006",
    name: "Porsche 911 Carrera",
    brand: "Porsche",
    model: "911 Carrera",
    year: 2024,
    type: "Sports",
    pricePerDay: 525,
    pricePerWeek: 3200,
    deposit: 3000,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 4,
    luggage: 1,
    mileage: "3,890 km",
    color: "Guards Red",
    registration: "DF-POR-2406",
    location: "Las Vegas",
    pickupPoint: "Strip Premium Lounge",
    available: true,
    rating: 5.0,
    reviews: 64,
    image: carSports,
    gallery: [carSports, carSedan, carLuxurySuv],
    features: ["Sport Chrono", "PDK Gearbox", "Sport Exhaust", "Bose Audio", "Launch Control"],
    description:
      "An icon, refined. The 911 Carrera delivers the unmistakable Porsche driving experience with surgical precision and timeless design.",
  },
  {
    id: "DF-007",
    name: "Hyundai Tucson",
    brand: "Hyundai",
    model: "Tucson",
    year: 2024,
    type: "SUV",
    pricePerDay: 72,
    pricePerWeek: 435,
    deposit: 500,
    transmission: "Automatic",
    fuel: "Hybrid",
    seats: 5,
    luggage: 3,
    mileage: "11,300 km",
    color: "Shimmering Silver",
    registration: "DF-HYU-2407",
    location: "Seattle",
    pickupPoint: "SEA Downtown Hub",
    available: true,
    rating: 4.7,
    reviews: 142,
    image: carSuv,
    gallery: [carSuv, carEv, carCompact],
    features: ["Hybrid", "Wireless CarPlay", "Heated Steering", "Highway Assist"],
    description:
      "Bold styling meets sensible value. The Tucson is a refined hybrid SUV ready for any adventure.",
  },
  {
    id: "DF-008",
    name: "Nissan Altima",
    brand: "Nissan",
    model: "Altima",
    year: 2023,
    type: "Sedan",
    pricePerDay: 62,
    pricePerWeek: 375,
    deposit: 450,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    luggage: 2,
    mileage: "18,200 km",
    color: "Storm Blue",
    registration: "DF-NIS-2308",
    location: "Boston",
    pickupPoint: "BOS Logan Center",
    available: true,
    rating: 4.5,
    reviews: 201,
    image: carSedan,
    gallery: [carSedan, carCompact, carSports],
    features: ["ProPILOT", "Apple CarPlay", "Bose Audio", "Heated Seats"],
    description:
      "A comfortable, confident sedan with a quiet ride and intuitive technology — perfect for business trips and weekend getaways.",
  },
];

export const brands = ["Mercedes", "BMW", "Toyota", "Tesla", "Honda", "Porsche", "Hyundai", "Nissan"];
export const carTypes: CarType[] = ["Sedan", "SUV", "Sports", "Compact", "Electric", "Luxury"];
export const fuelTypes: FuelType[] = ["Petrol", "Diesel", "Electric", "Hybrid"];
export const transmissions: Transmission[] = ["Automatic", "Manual"];
export const locations = ["New York", "Los Angeles", "Chicago", "San Francisco", "Miami", "Las Vegas", "Seattle", "Boston"];

export interface Booking {
  id: string;
  carId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  days: number;
  pickupLocation: string;
  total: number;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
  paymentStatus: "paid" | "pending" | "refunded";
}

export const bookings: Booking[] = [
  {
    id: "BK-10248",
    carId: "DF-001",
    customerName: "Olivia Martinez",
    customerEmail: "olivia.m@example.com",
    customerPhone: "+1 (212) 555-0142",
    startDate: "2025-04-22",
    endDate: "2025-04-26",
    days: 4,
    pickupLocation: "Manhattan Downtown",
    total: 1140,
    status: "approved",
    createdAt: "2025-04-15",
    notes: "Anniversary trip — please prepare car with full tank.",
    paymentStatus: "paid",
  },
  {
    id: "BK-10249",
    carId: "DF-004",
    customerName: "James Wilson",
    customerEmail: "j.wilson@example.com",
    customerPhone: "+1 (415) 555-0188",
    startDate: "2025-04-20",
    endDate: "2025-04-23",
    days: 3,
    pickupLocation: "SFO Airport",
    total: 435,
    status: "active",
    createdAt: "2025-04-12",
    paymentStatus: "paid",
  },
  {
    id: "BK-10250",
    carId: "DF-002",
    customerName: "Sophia Chen",
    customerEmail: "sophia.c@example.com",
    customerPhone: "+1 (310) 555-0177",
    startDate: "2025-04-28",
    endDate: "2025-05-02",
    days: 4,
    pickupLocation: "LAX Airport Terminal 4",
    total: 780,
    status: "pending",
    createdAt: "2025-04-17",
    notes: "Need a child seat if available.",
    paymentStatus: "pending",
  },
  {
    id: "BK-10251",
    carId: "DF-006",
    customerName: "Daniel Brooks",
    customerEmail: "d.brooks@example.com",
    customerPhone: "+1 (702) 555-0119",
    startDate: "2025-05-04",
    endDate: "2025-05-06",
    days: 2,
    pickupLocation: "Strip Premium Lounge",
    total: 1050,
    status: "pending",
    createdAt: "2025-04-18",
    paymentStatus: "pending",
  },
  {
    id: "BK-10252",
    carId: "DF-003",
    customerName: "Ava Patel",
    customerEmail: "ava.p@example.com",
    customerPhone: "+1 (312) 555-0133",
    startDate: "2025-04-10",
    endDate: "2025-04-14",
    days: 4,
    pickupLocation: "O'Hare Rental Center",
    total: 356,
    status: "completed",
    createdAt: "2025-04-05",
    paymentStatus: "paid",
  },
  {
    id: "BK-10253",
    carId: "DF-005",
    customerName: "Marcus Johnson",
    customerEmail: "marcus.j@example.com",
    customerPhone: "+1 (305) 555-0156",
    startDate: "2025-04-08",
    endDate: "2025-04-11",
    days: 3,
    pickupLocation: "MIA Airport",
    total: 165,
    status: "rejected",
    createdAt: "2025-04-06",
    notes: "Vehicle unavailable for requested dates.",
    paymentStatus: "refunded",
  },
  {
    id: "BK-10254",
    carId: "DF-007",
    customerName: "Emma Schmidt",
    customerEmail: "emma.s@example.com",
    customerPhone: "+1 (206) 555-0192",
    startDate: "2025-03-30",
    endDate: "2025-04-04",
    days: 5,
    pickupLocation: "SEA Downtown Hub",
    total: 360,
    status: "completed",
    createdAt: "2025-03-25",
    paymentStatus: "paid",
  },
  {
    id: "BK-10255",
    carId: "DF-008",
    customerName: "Liam O'Connor",
    customerEmail: "liam.oc@example.com",
    customerPhone: "+1 (617) 555-0145",
    startDate: "2025-04-25",
    endDate: "2025-04-27",
    days: 2,
    pickupLocation: "BOS Logan Center",
    total: 124,
    status: "cancelled",
    createdAt: "2025-04-16",
    paymentStatus: "refunded",
  },
];

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  totalBookings: number;
  activeBookings: number;
  totalSpend: number;
  status: "active" | "inactive";
  avatar?: string;
}

export const customers: Customer[] = [
  { id: "CU-001", name: "Olivia Martinez", email: "olivia.m@example.com", phone: "+1 (212) 555-0142", joinedAt: "2024-01-12", totalBookings: 14, activeBookings: 1, totalSpend: 8420, status: "active" },
  { id: "CU-002", name: "James Wilson", email: "j.wilson@example.com", phone: "+1 (415) 555-0188", joinedAt: "2024-03-04", totalBookings: 9, activeBookings: 1, totalSpend: 4680, status: "active" },
  { id: "CU-003", name: "Sophia Chen", email: "sophia.c@example.com", phone: "+1 (310) 555-0177", joinedAt: "2023-09-22", totalBookings: 22, activeBookings: 0, totalSpend: 12340, status: "active" },
  { id: "CU-004", name: "Daniel Brooks", email: "d.brooks@example.com", phone: "+1 (702) 555-0119", joinedAt: "2024-06-18", totalBookings: 5, activeBookings: 1, totalSpend: 3850, status: "active" },
  { id: "CU-005", name: "Ava Patel", email: "ava.p@example.com", phone: "+1 (312) 555-0133", joinedAt: "2024-02-08", totalBookings: 11, activeBookings: 0, totalSpend: 4220, status: "active" },
  { id: "CU-006", name: "Marcus Johnson", email: "marcus.j@example.com", phone: "+1 (305) 555-0156", joinedAt: "2024-08-30", totalBookings: 3, activeBookings: 0, totalSpend: 980, status: "inactive" },
  { id: "CU-007", name: "Emma Schmidt", email: "emma.s@example.com", phone: "+1 (206) 555-0192", joinedAt: "2023-11-14", totalBookings: 18, activeBookings: 0, totalSpend: 7240, status: "active" },
  { id: "CU-008", name: "Liam O'Connor", email: "liam.oc@example.com", phone: "+1 (617) 555-0145", joinedAt: "2024-05-20", totalBookings: 6, activeBookings: 0, totalSpend: 1820, status: "active" },
];

export const statusLabels: Record<BookingStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const revenueData = [
  { month: "Nov", revenue: 28400, bookings: 142 },
  { month: "Dec", revenue: 34200, bookings: 168 },
  { month: "Jan", revenue: 31800, bookings: 154 },
  { month: "Feb", revenue: 38600, bookings: 182 },
  { month: "Mar", revenue: 42100, bookings: 201 },
  { month: "Apr", revenue: 47800, bookings: 224 },
];

export const fleetUtilization = [
  { name: "Booked", value: 62 },
  { name: "Available", value: 28 },
  { name: "Maintenance", value: 10 },
];

export function getCar(id: string) {
  return cars.find((c) => c.id === id);
}

export function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
