import { Link } from "react-router-dom";
import { Heart, Users, Fuel, Cog, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Car } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface CarCardProps {
  car: Car;
  view?: "grid" | "list";
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function CarCard({ car, view = "grid", isFavorite, onToggleFavorite }: CarCardProps) {
  if (view === "list") {
    return (
      <article className="card-elevated group overflow-hidden p-3 sm:p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link to={`/cars/${car.id}`} className="relative block aspect-[16/10] w-full overflow-hidden rounded-xl bg-secondary sm:w-72 sm:flex-none">
            <img
              src={car.image}
              alt={`${car.name} for rent in ${car.location}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span
              className={cn(
                "absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium",
                car.available ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {car.available ? "Available" : "Booked"}
            </span>
          </Link>

          <div className="flex flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{car.type} · {car.brand}</p>
                <Link to={`/cars/${car.id}`}>
                  <h3 className="mt-1 text-lg font-semibold leading-tight hover:text-accent">{car.name}</h3>
                </Link>
              </div>
              <button
                onClick={() => onToggleFavorite?.(car.id)}
                aria-label="Save to favorites"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background hover:bg-secondary"
              >
                <Heart className={cn("h-4 w-4", isFavorite && "fill-destructive text-destructive")} />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground sm:grid-cols-4">
              <Spec icon={Cog} label={car.transmission} />
              <Spec icon={Fuel} label={car.fuel} />
              <Spec icon={Users} label={`${car.seats} Seats`} />
              <Spec icon={MapPin} label={car.location} />
            </div>

            <div className="mt-auto flex items-end justify-between pt-4">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(car.pricePerDay)}<span className="text-sm font-normal text-muted-foreground">/day</span></p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm"><Link to={`/cars/${car.id}`}>Details</Link></Button>
                <Button asChild size="sm" disabled={!car.available}><Link to={`/cars/${car.id}`}>Book Now</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card-elevated group flex flex-col overflow-hidden">
      <Link to={`/cars/${car.id}`} className="relative block aspect-[16/10] overflow-hidden bg-secondary">
        <img
          src={car.image}
          alt={`${car.name} for rent in ${car.location}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium shadow-soft",
            car.available ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {car.available ? "Available" : "Booked"}
        </span>
        <button
          onClick={(e) => { e.preventDefault(); onToggleFavorite?.(car.id); }}
          aria-label="Save to favorites"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background"
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-destructive text-destructive")} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{car.type} · {car.brand}</p>
        <Link to={`/cars/${car.id}`}>
          <h3 className="mt-1 text-base font-semibold leading-tight hover:text-accent">{car.name}</h3>
        </Link>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <Spec icon={Cog} label={car.transmission} />
          <Spec icon={Fuel} label={car.fuel} />
          <Spec icon={Users} label={`${car.seats} Seats`} />
          <Spec icon={MapPin} label={car.location} />
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-xl font-bold">{formatCurrency(car.pricePerDay)}<span className="text-sm font-normal text-muted-foreground">/day</span></p>
          </div>
          <Button asChild size="sm" disabled={!car.available}>
            <Link to={`/cars/${car.id}`}>Book Now</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="truncate">{label}</span>
    </div>
  );
}
