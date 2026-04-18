import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Pencil, Trash2, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cars, formatCurrency } from "@/lib/mock-data";
import { toast } from "sonner";

export default function AdminCars() {
  const [q, setQ] = useState("");
  const filtered = cars.filter((c) => `${c.name} ${c.brand}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Fleet management</h1>
          <p className="mt-1 text-muted-foreground">{cars.length} vehicles in your fleet</p>
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
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8"><Link href={`/cars/${car.id}`}><Eye className="h-4 w-4" /></Link></Button>
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
                            <AlertDialogAction onClick={() => toast.success("Car deleted")} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
