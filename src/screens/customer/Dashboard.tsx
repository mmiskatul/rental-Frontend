import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Activity, Clock, CheckCircle2, ArrowRight, Bell } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { CarCard } from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cars, formatCurrency, type Booking } from "@/lib/mock-data";
import { listBookings } from "@/lib/bookings-api";
import { toast } from "sonner";

type CustomerBooking = Booking & { carName?: string; carImage?: string | null };

export default function Dashboard() {
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const recommended = cars.filter((c) => c.available).slice(0, 3);
  const recent = bookings.slice(0, 4);
  const active = bookings.filter((booking) => booking.status === "active" || booking.status === "approved").length;
  const pending = bookings.filter((booking) => booking.status === "pending").length;
  const completed = bookings.filter((booking) => booking.status === "completed").length;

  useEffect(() => {
    let mounted = true;

    async function loadBookings() {
      try {
        const loaded = await listBookings();
        if (mounted) setBookings(loaded);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load your bookings.");
      }
    }

    loadBookings();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Welcome back</h1>
        <p className="mt-1 text-muted-foreground">Here's what's happening with your rentals.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total bookings" value={String(bookings.length)} icon={CalendarCheck} />
        <KpiCard label="Active rentals" value={String(active)} icon={Activity} iconClassName="bg-success-soft text-success" />
        <KpiCard label="Pending requests" value={String(pending)} icon={Clock} iconClassName="bg-warning-soft text-warning" />
        <KpiCard label="Completed" value={String(completed)} icon={CheckCircle2} iconClassName="bg-info-soft text-info" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent bookings</h2>
            <Button asChild variant="ghost" size="sm"><Link href="/dashboard/bookings">View all <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
          </div>
          <div className="mt-4 space-y-3">
            {recent.map((b) => (
              <Link key={b.id} href={`/dashboard/bookings/${b.id}`} className="flex items-center gap-4 rounded-xl border border-border p-3 hover:bg-secondary/50">
                {b.carImage ? <img src={b.carImage} alt="" className="h-14 w-20 rounded-lg object-cover" /> : <div className="h-14 w-20 rounded-lg bg-secondary" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">{b.carName}</p>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{b.id} - {b.startDate} - {b.endDate}</p>
                </div>
                <p className="font-semibold">{formatCurrency(b.total)}</p>
              </Link>
            ))}
            {recent.length === 0 && <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No booking requests yet.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4 space-y-3">
            {recent.slice(0, 3).map((booking) => (
              <div key={booking.id} className="flex gap-3">
                <div className={`mt-1.5 h-2 w-2 flex-none rounded-full ${booking.status === "approved" ? "bg-success" : "bg-warning"}`} />
                <div>
                  <p className="text-sm font-medium">Booking {booking.id} {booking.status}</p>
                  <p className="text-xs text-muted-foreground">{booking.carName}</p>
                </div>
              </div>
            ))}
            {recent.length === 0 && <p className="text-sm text-muted-foreground">No booking updates yet.</p>}
          </div>
          <Button asChild variant="outline" size="sm" className="mt-5 w-full">
            <Link href="/dashboard/notifications">See all notifications</Link>
          </Button>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Recommended for you</h2>
          <Button asChild variant="ghost" size="sm"><Link href="/cars">Browse fleet <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
        </div>
        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommended.map((c) => <CarCard key={c.id} car={c} />)}
        </div>
      </div>
    </div>
  );
}
