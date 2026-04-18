import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Pencil, Trash2, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Car } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/mock-data";
import { deleteCar, listCars } from "@/lib/cars-api";
import { toast } from "sonner";

export default function AdminCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const filtered = cars.filter((c) => `${c.name} ${c.brand}`.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    loadCars();
  }, []);

  async function loadCars() {
    setIsLoading(true);
    try {
      setCars(await listCars());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load cars.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCar(id);
      setCars((current) => current.filter((car) => car.id !== id));
      toast.success("Car deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete car.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Fleet management</h1>
          <p className="mt-1 text-muted-foreground">{isLoading ? "Loading vehicles..." : `${cars.length} vehicles in your fleet`}</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-glow"><Link href="/admin/cars/new"><Plus className="mr-2 h-4 w-4" /> Add new car</Link></Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name or brand…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select defaultValue="all"><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All types</SelectItem><SelectItem value="suv">SUV</SelectItem><SelectItem value="sedan">Sedan</SelectItem></SelectContent></Select>
          <Select defaultValue="all"><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All status</SelectItem><SelectItem value="available">Available</SelectItem><SelectItem value="booked">Booked</SelectItem></SelectContent></Select>
          <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" /> More</Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Daily price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((car) => (
                <tr key={car.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={car.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold">{car.name}</p>
                        <p className="text-xs text-muted-foreground">{car.brand} · {car.year} · {car.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{car.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{car.location}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(car.pricePerDay)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${car.available ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>
                      {car.available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`View ${car.name}`}
                        onClick={() => setSelectedCar(car)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8"><Link href={`/admin/cars/${car.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {car.name}?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone. The car will be removed from your fleet.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(car.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-muted-foreground" colSpan={6}>No cars found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!selectedCar} onOpenChange={(open) => !open && setSelectedCar(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          {selectedCar && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-8">{selectedCar.name}</DialogTitle>
                <DialogDescription>
                  {selectedCar.brand} {selectedCar.model} - {selectedCar.year} - {selectedCar.id}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
                <img src={selectedCar.image} alt={selectedCar.name} className="aspect-[16/10] w-full rounded-lg object-cover" />

                <div className="space-y-4">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rental price</p>
                    <p className="mt-1 text-2xl font-bold">{formatCurrency(selectedCar.pricePerDay)}</p>
                    <p className="text-sm text-muted-foreground">per day</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <VehicleDetail label="Type" value={selectedCar.type} />
                    <VehicleDetail label="Status" value={selectedCar.available ? "Available" : "Unavailable"} />
                    <VehicleDetail label="Location" value={selectedCar.location} />
                    <VehicleDetail label="Seats" value={`${selectedCar.seats}`} />
                    <VehicleDetail label="Transmission" value={selectedCar.transmission} />
                    <VehicleDetail label="Fuel" value={selectedCar.fuel} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold">Description</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedCar.description}</p>
              </div>

              <DialogFooter>
                <Button asChild variant="outline">
                  <Link href={`/admin/cars/${selectedCar.id}/edit`}>Edit vehicle</Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function VehicleDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
