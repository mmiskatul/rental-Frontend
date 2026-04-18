import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, ImagePlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brands, carTypes, fuelTypes, transmissions, locations, type Car } from "@/lib/mock-data";
import { toast } from "sonner";

export default function AddCar({ initial }: { initial?: Partial<Car> } = {}) {
  const router = useRouter();
  const isEdit = !!initial;
  return (
    <div className="space-y-6">
      <Link href="/admin/cars" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to fleet
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{isEdit ? "Edit car" : "Add new car"}</h1>
          <p className="mt-1 text-muted-foreground">{isEdit ? "Update vehicle information." : "Provide vehicle details to add it to the fleet."}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Draft saved")}>Save draft</Button>
          <Button className="bg-primary hover:bg-primary-glow" onClick={() => { toast.success(isEdit ? "Car updated" : "Car published"); router.push("/admin/cars"); }}>{isEdit ? "Update" : "Publish car"}</Button>
        </div>
      </div>

      <form className="grid gap-6 lg:grid-cols-3" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Basic information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div><Label>Brand</Label>
                <Select defaultValue={initial?.brand}><SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>{brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Model</Label><Input defaultValue={initial?.model} placeholder="e.g. S-Class" /></div>
              <div className="sm:col-span-2"><Label>Display name</Label><Input defaultValue={initial?.name} placeholder="e.g. Mercedes S-Class" /></div>
              <div><Label>Year</Label><Input type="number" defaultValue={initial?.year ?? 2024} /></div>
              <div><Label>Registration number</Label><Input defaultValue={initial?.registration} placeholder="DF-XXX-XXXX" /></div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Vehicle specifications</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div><Label>Type</Label>
                <Select defaultValue={initial?.type}><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>{carTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Transmission</Label>
                <Select defaultValue={initial?.transmission}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{transmissions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Fuel type</Label>
                <Select defaultValue={initial?.fuel}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{fuelTypes.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Seats</Label><Input type="number" defaultValue={initial?.seats ?? 5} /></div>
              <div><Label>Luggage capacity</Label><Input type="number" defaultValue={initial?.luggage ?? 3} /></div>
              <div><Label>Color</Label><Input defaultValue={initial?.color} placeholder="e.g. Midnight Blue" /></div>
              <div className="sm:col-span-2"><Label>Mileage</Label><Input defaultValue={initial?.mileage} placeholder="e.g. 8,420 km" /></div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Description & features</h2>
            <div className="mt-5 space-y-4">
              <div><Label>Description</Label><Textarea rows={4} defaultValue={initial?.description} placeholder="Describe the car…" /></div>
              <div><Label>Features (comma separated)</Label><Input defaultValue={initial?.features?.join(", ")} placeholder="Leather Seats, Panoramic Roof, …" /></div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Rental configuration</h2>
            <div className="mt-5 space-y-4">
              <div><Label>Daily price ($)</Label><Input type="number" defaultValue={initial?.pricePerDay ?? 100} /></div>
              <div><Label>Weekly price ($)</Label><Input type="number" defaultValue={initial?.pricePerWeek ?? 600} /></div>
              <div><Label>Security deposit ($)</Label><Input type="number" defaultValue={initial?.deposit ?? 500} /></div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Location & availability</h2>
            <div className="mt-5 space-y-4">
              <div><Label>City</Label>
                <Select defaultValue={initial?.location}><SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                  <SelectContent>{locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Pickup point</Label><Input defaultValue={initial?.pickupPoint} placeholder="e.g. Manhattan Downtown" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Available from</Label><Input type="date" /></div>
                <div><Label>Available to</Label><Input type="date" /></div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Media</h2>
            <div className="mt-5 space-y-3">
              <div className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 text-muted-foreground hover:border-accent hover:bg-accent-soft">
                <Upload className="h-6 w-6" />
                <p className="text-xs">Upload main image</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-accent">
                    <ImagePlus className="h-4 w-4" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
