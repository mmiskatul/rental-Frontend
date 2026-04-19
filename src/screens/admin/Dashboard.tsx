import { useEffect, useState } from "react";
import Link from "next/link";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Car, CalendarRange, Clock, Users, DollarSign, TrendingUp, ArrowRight, KeyRound, RotateCcw } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, type Booking, type BookingStatus } from "@/lib/mock-data";
import { confirmReturn, listBookings, requestPickup, updateBookingStatus } from "@/lib/bookings-api";
import { getAdminOverview, type AdminOverview } from "@/lib/overview-api";
import { toast } from "sonner";

const COLORS = ["hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--muted))"];
type AdminBooking = Booking & { carName?: string; carImage?: string | null };

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [overview, setOverview] = useState<AdminOverview | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [bookingList, overviewData] = await Promise.all([listBookings(), getAdminOverview()]);
      setBookings(bookingList);
      setOverview(overviewData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load admin overview.");
    }
  }

  async function refreshOverview() {
    try {
      setOverview(await getAdminOverview());
    } catch {
      // Booking actions already succeeded; avoid stacking secondary errors.
    }
  }

  async function handleStatus(id: string, status: BookingStatus) {
    try {
      const updated = await updateBookingStatus(id, status);
      setBookings((current) => current.map((booking) => (booking.id === id ? updated : booking)));
      await refreshOverview();
      toast.success(status === "approved" ? "Booking approved" : "Booking rejected");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update booking.");
    }
  }

  async function handleLifecycle(id: string, action: "pickup" | "return") {
    try {
      const updated = action === "pickup" ? await requestPickup(id) : await confirmReturn(id);
      setBookings((current) => current.map((booking) => (booking.id === id ? updated : booking)));
      await refreshOverview();
      toast.success(action === "pickup" ? "Pickup confirmation request sent" : "Return confirmed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update booking.");
    }
  }

  const pending = bookings.filter((b) => b.status === "pending");
  const pickupReady = bookings.filter((b) => b.status === "approved");
  const returnReady = bookings.filter((b) => b.status === "return_requested");
  const recent = bookings.slice(0, 5);
  const revenueTrend = overview?.revenueTrend ?? [];
  const fleetDistribution = overview?.fleetDistribution ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Snapshot of fleet performance and operations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total cars" value={overview?.totalCars ?? 0} icon={Car} />
        <KpiCard label="Active bookings" value={overview?.activeBookings ?? 0} icon={CalendarRange} iconClassName="bg-success-soft text-success" />
        <KpiCard label="Pending requests" value={overview?.pendingRequests ?? 0} icon={Clock} iconClassName="bg-warning-soft text-warning" />
        <KpiCard label="Monthly revenue" value={formatCurrency(overview?.monthlyRevenue ?? 0)} icon={DollarSign} iconClassName="bg-info-soft text-info" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Available cars" value={overview?.availableCars ?? 0} icon={Car} iconClassName="bg-success-soft text-success" />
        <KpiCard label="Booked cars" value={overview?.bookedCars ?? 0} icon={Car} iconClassName="bg-info-soft text-info" />
        <KpiCard label="Total customers" value={overview?.totalCustomers ?? 0} icon={Users} />
        <KpiCard label="Fleet utilization" value={`${overview?.fleetUtilization ?? 0}%`} icon={TrendingUp} iconClassName="bg-accent-soft text-accent" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Revenue trend</h2>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <Button variant="ghost" size="sm">Export</Button>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold">Fleet utilization</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={fleetDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {fleetDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5 text-sm">
            {fleetDistribution.map((f, i) => (
              <div key={f.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />{f.name}</div>
                <span className="font-semibold">{f.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent bookings</h2>
            <Button asChild variant="ghost" size="sm"><Link href="/admin/bookings">View all <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
          </div>
          <div className="mt-4 space-y-2">
            {recent.map((b) => (
              <Link key={b.id} href={`/admin/bookings/${b.id}`} className="flex items-center gap-4 rounded-xl border border-border p-3 hover:bg-secondary/50">
                {b.carImage ? <img src={b.carImage} alt="" className="h-12 w-16 rounded-lg object-cover" /> : <div className="h-12 w-16 rounded-lg bg-secondary" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{b.carName}</p>
                  <p className="text-xs text-muted-foreground">{b.customerName} - {b.id}</p>
                </div>
                <StatusBadge status={b.status} />
                <p className="hidden text-sm font-semibold sm:block">{formatCurrency(b.total)}</p>
              </Link>
            ))}
            {recent.length === 0 && <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No booking requests yet.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold">Pending approvals</h2>
          <p className="text-xs text-muted-foreground">{pending.length + pickupReady.length + returnReady.length} operational requests</p>
          <div className="mt-4 space-y-3">
            {pending.map((b) => (
              <div key={b.id} className="rounded-xl border border-border p-3">
                <p className="text-sm font-semibold">{b.customerName}</p>
                <p className="text-xs text-muted-foreground">{b.carName} - {b.days} days</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" className="flex-1 h-8 bg-success hover:bg-success/90 text-success-foreground" onClick={() => handleStatus(b.id, "approved")}>Approve</Button>
                  <Button size="sm" variant="outline" className="flex-1 h-8" onClick={() => handleStatus(b.id, "rejected")}>Reject</Button>
                </div>
              </div>
            ))}
            {pickupReady.map((b) => (
              <div key={b.id} className="rounded-xl border border-border p-3">
                <p className="text-sm font-semibold">{b.customerName}</p>
                <p className="text-xs text-muted-foreground">{b.carName} - approved for pickup</p>
                <Button size="sm" variant="outline" className="mt-2 h-8 w-full" onClick={() => handleLifecycle(b.id, "pickup")}><KeyRound className="mr-2 h-3.5 w-3.5" /> Request Pickup</Button>
              </div>
            ))}
            {returnReady.map((b) => (
              <div key={b.id} className="rounded-xl border border-border p-3">
                <p className="text-sm font-semibold">{b.customerName}</p>
                <p className="text-xs text-muted-foreground">{b.carName} - return requested</p>
                <Button size="sm" className="mt-2 h-8 w-full bg-success hover:bg-success/90 text-success-foreground" onClick={() => handleLifecycle(b.id, "return")}><RotateCcw className="mr-2 h-3.5 w-3.5" /> Confirm Return</Button>
              </div>
            ))}
            {pending.length + pickupReady.length + returnReady.length === 0 && <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">No pending requests.</p>}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold">Bookings trend</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer>
            <BarChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
