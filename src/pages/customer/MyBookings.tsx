import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { bookings, getCar, formatCurrency, type BookingStatus } from "@/lib/mock-data";

const tabs: ("all" | BookingStatus)[] = ["all", "pending", "approved", "active", "completed", "cancelled"];

export default function MyBookings() {
  const [tab, setTab] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = bookings.filter((b) => {
    if (tab !== "all" && b.status !== tab) return false;
    if (q && !`${b.id} ${getCar(b.carId)?.name}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">My Bookings</h1>
        <p className="mt-1 text-muted-foreground">Manage and track your reservations.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by booking ID or car…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="overflow-x-auto">
          {tabs.map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState title="No bookings found" description="Try a different filter or browse the fleet to make your first booking." action={<Button asChild><Link to="/cars">Browse cars</Link></Button>} />
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const car = getCar(b.carId);
            return (
              <Card key={b.id} className="overflow-hidden p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <img src={car?.image} alt="" className="h-20 w-32 flex-none rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{car?.name}</p>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">Booking {b.id} · Created {b.createdAt}</p>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                      <span>📅 {b.startDate} → {b.endDate}</span>
                      <span>📍 {b.pickupLocation}</span>
                      <span>⏱ {b.days} days</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:text-right">
                    <p className="text-lg font-bold">{formatCurrency(b.total)}</p>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/dashboard/bookings/${b.id}`}>View <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
