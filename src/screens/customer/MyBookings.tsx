import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Calendar, MapPin, Clock3, KeyRound, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatCurrency, type Booking, type BookingStatus } from "@/lib/mock-data";
import { confirmPickup, listBookings, requestReturn } from "@/lib/bookings-api";
import { toast } from "sonner";

const tabs: ("all" | BookingStatus)[] = ["all", "pending", "approved", "pickup_requested", "active", "return_requested", "completed", "cancelled"];
type CustomerBooking = Booking & { carName?: string; carImage?: string | null };

export default function MyBookings() {
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<string>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadBookings() {
      setIsLoading(true);
      try {
        const loaded = await listBookings();
        if (mounted) setBookings(loaded);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load your bookings.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadBookings();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = bookings.filter((b) => {
    if (tab !== "all" && b.status !== tab) return false;
    if (q && !`${b.id} ${b.carName ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  async function handleLifecycle(id: string, action: "pickup" | "return") {
    try {
      const updated = action === "pickup" ? await confirmPickup(id) : await requestReturn(id);
      setBookings((current) => current.map((booking) => (booking.id === id ? updated : booking)));
      toast.success(action === "pickup" ? "Pickup confirmed. Rental is now active." : "Return request sent to admin.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update booking.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">My Bookings</h1>
        <p className="mt-1 text-muted-foreground">{isLoading ? "Loading your booking requests..." : "Manage and track your reservations."}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by booking ID or car..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="overflow-x-auto">
          {tabs.map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {!isLoading && filtered.length === 0 ? (
        <EmptyState title="No bookings found" description="Try a different filter or browse the fleet to make your first booking." action={<Button asChild><Link href="/cars">Browse cars</Link></Button>} />
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <Card key={b.id} className="overflow-hidden p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {b.carImage ? <img src={b.carImage} alt="" className="h-20 w-32 flex-none rounded-xl object-cover" /> : <div className="h-20 w-32 flex-none rounded-xl bg-secondary" />}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{b.carName}</p>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">Booking {b.id} - Created {b.createdAt}</p>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {b.startDate} - {b.endDate}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {b.pickupLocation}</span>
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {b.days} days</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:text-right">
                  <p className="text-lg font-bold">{formatCurrency(b.total)}</p>
                  {b.status === "pickup_requested" && (
                    <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground" onClick={() => handleLifecycle(b.id, "pickup")}><KeyRound className="mr-1 h-3.5 w-3.5" /> Confirm Pickup</Button>
                  )}
                  {b.status === "active" && (
                    <Button size="sm" onClick={() => handleLifecycle(b.id, "return")}><RotateCcw className="mr-1 h-3.5 w-3.5" /> Request Return</Button>
                  )}
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/bookings/${b.id}`}>View <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
