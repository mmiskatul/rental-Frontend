import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brands, fuelTypes, locations, transmissions, type Car } from "@/lib/mock-data";
import { createCar, updateCar } from "@/lib/cars-api";
import { toast } from "sonner";

export default function AddCar({ initial }: { initial?: Partial<Car> } = {}) {
  const router = useRouter();
  const isEdit = !!initial;
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [title, setTitle] = useState(initial?.name ?? "");
  const [year, setYear] = useState(String(initial?.year ?? 2024));
  const [transmission, setTransmission] = useState<string>(initial?.transmission ?? "Automatic");
  const [fuelType, setFuelType] = useState<string>(initial?.fuel ?? "Petrol");
  const [seats, setSeats] = useState(String(initial?.seats ?? 5));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [pricePerDay, setPricePerDay] = useState(String(initial?.pricePerDay ?? 100));
  const [location, setLocation] = useState(initial?.location ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const yearValue = Number(year);
    const priceValue = Number(pricePerDay);
    const seatsValue = Number(seats);

    if (!brand) {
      toast.error("Select a brand before publishing.");
      return;
    }

    if (!location) {
      toast.error("Select a city before publishing.");
      return;
    }

    if (!title.trim() || !model.trim()) {
      toast.error("Enter the car display name and model.");
      return;
    }

    if (!Number.isFinite(yearValue) || yearValue < 1990 || yearValue > 2100) {
      toast.error("Enter a valid year between 1990 and 2100.");
      return;
    }

    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      toast.error("Enter a valid daily price.");
      return;
    }

    if (!Number.isFinite(seatsValue) || seatsValue < 1 || seatsValue > 20) {
      toast.error("Enter a valid seat count between 1 and 20.");
      return;
    }

    if (!image && !isEdit) {
      toast.error("Upload a main image before publishing.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        brand,
        model: model.trim(),
        year: yearValue,
        pricePerDay: priceValue,
        location,
        image,
        description: description.trim(),
        seats: seatsValue,
        transmission,
        fuelType,
      };

      if (isEdit && initial?.id) {
        await updateCar(initial.id, payload);
        toast.success("Car updated");
      } else {
        await createCar({ ...payload, image: image as File });
        toast.success("Car published");
      }
      router.push("/admin/cars");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not publish car.");
    } finally {
      setIsSubmitting(false);
    }
  }

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
        <Button form="car-form" type="submit" className="bg-primary hover:bg-primary-glow" disabled={isSubmitting}>
          {isSubmitting ? "Publishing..." : isEdit ? "Update" : "Publish car"}
        </Button>
      </div>

      <form id="car-form" className="grid gap-6 lg:grid-cols-3" onSubmit={handleSubmit}>
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Basic information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Brand</Label>
                <Select value={brand} onValueChange={setBrand} required>
                  <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>{brands.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Model</Label>
                <Input value={model} onChange={(event) => setModel(event.target.value)} placeholder="e.g. S-Class" required />
              </div>
              <div className="sm:col-span-2">
                <Label>Display name</Label>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Mercedes S-Class" required />
              </div>
              <div>
                <Label>Year</Label>
                <Input type="number" min={1990} max={2100} value={year} onChange={(event) => setYear(event.target.value)} required />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Vehicle specifications</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Transmission</Label>
                <Select value={transmission} onValueChange={setTransmission}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{transmissions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Fuel type</Label>
                <Select value={fuelType} onValueChange={setFuelType}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{fuelTypes.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Seats</Label>
                <Input type="number" min={1} max={20} value={seats} onChange={(event) => setSeats(event.target.value)} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Description</h2>
            <div className="mt-5">
              <Label>Description</Label>
              <Textarea rows={5} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the car..." />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Rental configuration</h2>
            <div className="mt-5">
              <Label>Daily price ($)</Label>
              <Input type="number" min={1} value={pricePerDay} onChange={(event) => setPricePerDay(event.target.value)} required />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Location</h2>
            <div className="mt-5">
              <Label>City</Label>
              <Select value={location} onValueChange={setLocation} required>
                <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent>{locations.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Media</h2>
            <label className="mt-5 flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 text-muted-foreground hover:border-accent hover:bg-accent-soft">
              <Upload className="h-6 w-6" />
              <span className="text-xs">{image ? image.name : "Upload main image"}</span>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => setImage(event.target.files?.[0] ?? null)}
              />
            </label>
          </Card>
        </div>
      </form>
    </div>
  );
}
