import { Link } from "react-router-dom";
import { CalendarCheck, Activity, Clock, CheckCircle2, ArrowRight, Bell } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { CarCard } from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { bookings, cars, getCar, formatCurrency } from "@/lib/mock-data";

export default function Dashboard() {
  const recent = bookings.slice(0, 4);
  const recommended = cars.filter((c) => c.available).slice(0, 3);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Welcome back, Olivia 👋</h1>
        <p className="mt-1 text-muted-foreground">Here's what's happening with your rentals.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total bookings" value="14" icon={CalendarCheck} trend={{ value: "12% vs last month", positive: true }} />
        <KpiCard label="Active rentals" value="1" icon={Activity} iconClassName="bg-success-soft text-success" />
        <KpiCard label="Pending requests" value="2" icon={Clock} iconClassName="bg-warning-soft text-warning" />
        <KpiCard label="Completed" value="9" icon={CheckCircle2} iconClassName="bg-info-soft text-info" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent bookings</h2>
            <Button asChild variant="ghost" size="sm"><Link to="/dashboard/bookings">View all <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
          </div>
          <div className="mt-4 space-y-3">
            {recent.map((b) => {
              const car = getCar(b.carId);
              return (
                <Link key={b.id} to={`/dashboard/bookings/${b.id}`} className="flex items-center gap-4 rounded-xl border border-border p-3 hover:bg-secondary/50">
                  <img src={car?.image} alt="" className="h-14 w-20 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold">{car?.name}</p>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{b.id} · {b.startDate} → {b.endDate}</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(b.total)}</p>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4 space-y-3">
            {[
              { title: "Booking BK-10248 approved", time: "2h ago", color: "bg-success" },
              { title: "Reminder: pickup tomorrow", time: "5h ago", color: "bg-warning" },
              { title: "New car added near you", time: "1d ago", color: "bg-info" },
            ].map((n, i) => (
              <div key={i} className="flex gap-3">
                <div className={`mt-1.5 h-2 w-2 flex-none rounded-full ${n.color}`} />
                <div>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" size="sm" className="mt-5 w-full">
            <Link to="/dashboard/notifications">See all notifications</Link>
          </Button>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Recommended for you</h2>
          <Button asChild variant="ghost" size="sm"><Link to="/cars">Browse fleet <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
        </div>
        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommended.map((c) => <CarCard key={c.id} car={c} />)}
        </div>
      </div>
    </div>
  );
}
