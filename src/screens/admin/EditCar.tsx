import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Archive } from "lucide-react";
import type { Car } from "@/lib/mock-data";
import { deleteCar, getCarById } from "@/lib/cars-api";
import { toast } from "sonner";
import AddCar from "./AddCar";

export default function EditCar() {
  const params = useParams();
  const rawId = params?.id;
  const carId = Array.isArray(rawId) ? rawId[0] : rawId;
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCar() {
      if (!carId) return;

      try {
        const data = await getCarById(carId);
        if (mounted) setCar(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load car.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadCar();

    return () => {
      mounted = false;
    };
  }, [carId]);

  async function handleDelete() {
    if (!carId) return;

    try {
      await deleteCar(carId);
      toast.success("Car deleted");
      window.location.href = "/admin/cars";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete car.");
    }
  }

  if (isLoading) {
    return <div className="h-80 rounded-lg bg-secondary/70" />;
  }

  if (!car) {
    return <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">Car not found.</div>;
  }

  return (
    <div>
      <AddCar initial={car} />
      <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-6">
        <Button variant="outline" onClick={() => toast.success("Car archived")}><Archive className="mr-2 h-4 w-4" /> Archive car</Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-destructive hover:text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete car</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Permanently delete this car?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
