import { Link } from "react-router-dom";
import { Car, CalendarRange, Clock, Users, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { bookings, getCar, formatCurrency, revenueData, fleetUtilization } from "@/lib/mock-data";

const COLORS = ["hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--muted))"];

export default function AdminDashboard() {
  const pending = bookings.filter((b) => b.status === "pending");
  const recent = bookings.slice(0, 5);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Snapshot of fleet performance and operations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total cars" value="48" icon={Car} trend={{ value: "3 added this week", positive: true }} />
        <KpiCard label="Active bookings" value="12" icon={CalendarRange} iconClassName="bg-success-soft text-success" />
        <KpiCard label="Pending requests" value={String(pending.length)} icon={Clock} iconClassName="bg-warning-soft text-warning" />
        <KpiCard label="Monthly revenue" value={formatCurrency(47800)} icon={DollarSign} trend={{ value: "13.5% vs last month", positive: true }} iconClassName="bg-info-soft text-info" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Available cars" value="28" icon={Car} iconClassName="bg-success-soft text-success" />
        <KpiCard label="Booked cars" value="20" icon={Car} iconClassName="bg-info-soft text-info" />
        <KpiCard label="Total customers" value="1,248" icon={Users} />
        <KpiCard label="Fleet utilization" value="62%" icon={TrendingUp} iconClassName="bg-accent-soft text-accent" />
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
              <AreaChart data={revenueData}>
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
                <Pie data={fleetUtilization} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {fleetUtilization.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5 text-sm">
            {fleetUtilization.map((f, i) => (
              <div key={f.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[i] }} />{f.name}</div>
                <span className="font-semibold">{f.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent bookings</h2>
            <Button asChild variant="ghost" size="sm"><Link to="/admin/bookings">View all <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
          </div>
          <div className="mt-4 space-y-2">
            {recent.map((b) => {
              const car = getCar(b.carId);
              return (
                <Link key={b.id} to={`/admin/bookings/${b.id}`} className="flex items-center gap-4 rounded-xl border border-border p-3 hover:bg-secondary/50">
                  <img src={car?.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{car?.name}</p>
                    <p className="text-xs text-muted-foreground">{b.customerName} · {b.id}</p>
                  </div>
                  <StatusBadge status={b.status} />
                  <p className="hidden text-sm font-semibold sm:block">{formatCurrency(b.total)}</p>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold">Pending approvals</h2>
          <p className="text-xs text-muted-foreground">{pending.length} requests awaiting review</p>
          <div className="mt-4 space-y-3">
            {pending.map((b) => (
              <div key={b.id} className="rounded-xl border border-border p-3">
                <p className="text-sm font-semibold">{b.customerName}</p>
                <p className="text-xs text-muted-foreground">{getCar(b.carId)?.name} · {b.days} days</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" className="flex-1 h-8 bg-success hover:bg-success/90 text-success-foreground">Approve</Button>
                  <Button size="sm" variant="outline" className="flex-1 h-8">Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold">Bookings trend</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer>
            <BarChart data={revenueData}>
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
