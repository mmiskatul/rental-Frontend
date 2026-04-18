import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, LayoutGrid, List, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CarCard } from "@/components/CarCard";
import { EmptyState } from "@/components/EmptyState";
import type { Car } from "@/lib/mock-data";
import { brands, carTypes, fuelTypes, transmissions, locations } from "@/lib/mock-data";
import { listCars } from "@/lib/cars-api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [price, setPrice] = useState<number[]>([550]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedTrans, setSelectedTrans] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("all");
  const [availableOnly, setAvailableOnly] = useState(false);

  const toggle = (list: string[], v: string, set: (l: string[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  useEffect(() => {
    let mounted = true;

    async function loadCars() {
      try {
        const data = await listCars();
        if (mounted) setCars(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load cars.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadCars();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let r = cars.filter((c) => {
      if (search && !`${c.name} ${c.brand} ${c.model}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (c.pricePerDay > price[0]) return false;
      if (selectedBrands.length && !selectedBrands.includes(c.brand)) return false;
      if (selectedTypes.length && !selectedTypes.includes(c.type)) return false;
      if (selectedFuels.length && !selectedFuels.includes(c.fuel)) return false;
      if (selectedTrans.length && !selectedTrans.includes(c.transmission)) return false;
      if (location !== "all" && c.location !== location) return false;
      if (availableOnly && !c.available) return false;
      return true;
    });
    if (sort === "price-asc") r = [...r].sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.pricePerDay - a.pricePerDay);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [cars, search, price, selectedBrands, selectedTypes, selectedFuels, selectedTrans, location, availableOnly, sort]);

  const reset = () => {
    setSearch(""); setPrice([550]); setSelectedBrands([]); setSelectedTypes([]);
    setSelectedFuels([]); setSelectedTrans([]); setLocation("all"); setAvailableOnly(false);
  };

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">Our Fleet</p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Browse available vehicles</h1>
        <p className="mt-2 text-muted-foreground">{isLoading ? "Loading cars..." : `${filtered.length} cars ready to book`}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <aside className={cn(
          "lg:sticky lg:top-20 lg:h-fit lg:block",
          filtersOpen ? "fixed inset-0 z-50 overflow-auto bg-background p-6 lg:static lg:p-0" : "hidden",
        )}>
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={reset}>Reset</Button>
                <button className="lg:hidden" onClick={() => setFiltersOpen(false)}><X className="h-5 w-5" /></button>
              </div>
            </div>

            <div className="mt-5 space-y-6">
              <FilterGroup label="Location">
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    {locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FilterGroup>

              <FilterGroup label={`Max price: $${price[0]}/day`}>
                <Slider value={price} onValueChange={setPrice} min={50} max={600} step={10} />
              </FilterGroup>

              <FilterGroup label="Vehicle Type">
                <div className="space-y-2">
                  {carTypes.map((t) => (
                    <CheckRow key={t} label={t} checked={selectedTypes.includes(t)} onChange={() => toggle(selectedTypes, t, setSelectedTypes)} />
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Brand">
                <div className="space-y-2">
                  {brands.map((b) => (
                    <CheckRow key={b} label={b} checked={selectedBrands.includes(b)} onChange={() => toggle(selectedBrands, b, setSelectedBrands)} />
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Fuel Type">
                <div className="space-y-2">
                  {fuelTypes.map((f) => (
                    <CheckRow key={f} label={f} checked={selectedFuels.includes(f)} onChange={() => toggle(selectedFuels, f, setSelectedFuels)} />
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Transmission">
                <div className="space-y-2">
                  {transmissions.map((t) => (
                    <CheckRow key={t} label={t} checked={selectedTrans.includes(t)} onChange={() => toggle(selectedTrans, t, setSelectedTrans)} />
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Availability">
                <CheckRow label="Available only" checked={availableOnly} onChange={() => setAvailableOnly(!availableOnly)} />
              </FilterGroup>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name, brand…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Button variant="outline" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </Button>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex rounded-lg border border-border p-0.5">
              <button onClick={() => setView("grid")} className={cn("flex h-8 w-8 items-center justify-center rounded-md", view === "grid" && "bg-secondary")}>
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button onClick={() => setView("list")} className={cn("flex h-8 w-8 items-center justify-center rounded-md", view === "list" && "bg-secondary")}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => <div key={item} className="h-80 rounded-lg bg-secondary/70" />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No cars match your filters"
              description="Try adjusting your filters or expanding your search criteria."
              action={<Button onClick={reset}>Reset filters</Button>}
            />
          ) : (
            <div className={cn(view === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4")}>
              {filtered.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  view={view}
                  isFavorite={favorites.includes(car.id)}
                  onToggleFavorite={(id) => toggle(favorites, id, setFavorites)}
                />
              ))}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button size="sm" className="w-9">1</Button>
              <Button variant="outline" size="sm" className="w-9">2</Button>
              <Button variant="outline" size="sm" className="w-9">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={label} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={label} className="cursor-pointer text-sm font-normal">{label}</Label>
    </div>
  );
}
