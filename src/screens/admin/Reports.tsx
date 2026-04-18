import { Download, DollarSign, CalendarRange, Car as CarIcon, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KpiCard } from "@/components/KpiCard";
import { revenueData, formatCurrency } from "@/lib/mock-data";

const statusDist = [
  { name: "Approved", value: 38 }, { name: "Active", value: 22 }, { name: "Completed", value: 28 }, { name: "Pending", value: 8 }, { name: "Cancelled", value: 4 },
];
const COLORS = ["hsl(var(--info))", "hsl(var(--success))", "hsl(var(--primary))", "hsl(var(--warning))", "hsl(var(--muted))"];
const topCars = [
  { name: "Mercedes S-Class", bookings: 42, revenue: 11970 },
  { name: "Tesla Model Y", bookings: 38, revenue: 5510 },
  { name: "BMW X5", bookings: 31, revenue: 6045 },
  { name: "Toyota RAV4", bookings: 28, revenue: 2492 },
  { name: "Porsche 911", bookings: 14, revenue: 7350 },
];

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Reports & analytics</h1>
          <p className="mt-1 text-muted-foreground">Performance insights across the entire platform.</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="6m"><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="1m">Last month</SelectItem><SelectItem value="3m">Last 3 months</SelectItem><SelectItem value="6m">Last 6 months</SelectItem><SelectItem value="12m">Last year</SelectItem></SelectContent>
          </Select>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total revenue" value={formatCurrency(222900)} icon={DollarSign} trend={{ value: "18% YoY", positive: true }} />
        <KpiCard label="Total bookings" value="1,071" icon={CalendarRange} trend={{ value: "12% YoY", positive: true }} />
        <KpiCard label="Average booking" value={formatCurrency(208)} icon={TrendingUp} />
        <KpiCard label="Fleet utilization" value="62%" icon={CarIcon} trend={{ value: "4% vs last period", positive: true }} />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold">Revenue & bookings trend</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Booking status distribution</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusDist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold">Top performing cars</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={topCars} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" width={110} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Bar dataKey="bookings" fill="hsl(var(--accent))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border p-6"><h2 className="text-lg font-semibold">Top performers</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Vehicle</th><th className="px-4 py-3">Bookings</th><th className="px-4 py-3">Revenue</th><th className="px-4 py-3">Utilization</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topCars.map((c) => (
                <tr key={c.name}>
                  <td className="px-4 py-3 font-semibold">{c.name}</td>
                  <td className="px-4 py-3">{c.bookings}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(c.revenue)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2"><div className="h-1.5 w-32 rounded-full bg-secondary"><div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, c.bookings * 2)}%` }} /></div><span className="text-xs text-muted-foreground">{Math.min(100, c.bookings * 2)}%</span></div>
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
