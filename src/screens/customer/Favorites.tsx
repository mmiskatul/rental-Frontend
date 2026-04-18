import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { CarCard } from "@/components/CarCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { cars } from "@/lib/mock-data";

export default function Favorites() {
  const [favorites, setFavorites] = useState<string[]>(["DF-001", "DF-004", "DF-006"]);
  const list = cars.filter((c) => favorites.includes(c.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Favorites</h1>
        <p className="mt-1 text-muted-foreground">{list.length} saved vehicles</p>
      </div>

      {list.length === 0 ? (
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
              onToggleFavorite={(id) => setFavorites(favorites.filter((f) => f !== id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
