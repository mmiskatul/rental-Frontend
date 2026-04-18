import { useParams } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Archive } from "lucide-react";
import { getCar } from "@/lib/mock-data";
import { toast } from "sonner";
import AddCar from "./AddCar";

export default function EditCar() {
  const params = useParams();
  const rawId = params?.id;
  const carId = Array.isArray(rawId) ? rawId[0] : rawId;
  const car = getCar(carId ?? "");
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
            <AlertDialogHeader><AlertDialogTitle>Permanently delete this car?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => toast.success("Car deleted")} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
