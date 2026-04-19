import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { CarCard } from "@/components/CarCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import type { Car } from "@/lib/mock-data";
import { listFavoriteCars, removeFavoriteCar } from "@/lib/favorites-api";
import { toast } from "sonner";

export default function Favorites() {
  const [list, setList] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadFavorites() {
      try {
        const data = await listFavoriteCars();
        if (mounted) setList(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load favorites.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadFavorites();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleRemoveFavorite(id: string) {
    const previous = list;
    setList((current) => current.filter((car) => car.id !== id));

    try {
      await removeFavoriteCar(id);
      toast.success("Removed from favorites");
    } catch (error) {
      setList(previous);
      toast.error(error instanceof Error ? error.message : "Could not remove favorite.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Favorites</h1>
        <p className="mt-1 text-muted-foreground">{isLoading ? "Loading saved vehicles..." : `${list.length} saved vehicles`}</p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-80 rounded-lg bg-secondary/70" />)}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Save vehicles you love to quickly book them later."
          action={<Button asChild><Link href="/cars">Browse cars</Link></Button>}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <CarCard
              key={c.id}
              car={c}
              isFavorite
              onToggleFavorite={handleRemoveFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
