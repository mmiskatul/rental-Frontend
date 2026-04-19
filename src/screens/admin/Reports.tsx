import { useEffect, useState } from "react";
import { Download, DollarSign, CalendarRange, Car as CarIcon, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KpiCard } from "@/components/KpiCard";
import { formatCurrency } from "@/lib/mock-data";
import { getAdminReports, type AdminReports as AdminReportsData } from "@/lib/reports-api";
import { listReviews, type Review } from "@/lib/reviews-api";
import { toast } from "sonner";

const COLORS = ["hsl(var(--info))", "hsl(var(--success))", "hsl(var(--primary))", "hsl(var(--warning))", "hsl(var(--muted))"];

export default function AdminReports() {
  const [reports, setReports] = useState<AdminReportsData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function loadReports() {
      try {
        const [reportsData, reviewList] = await Promise.all([getAdminReports(), listReviews()]);
        setReports(reportsData);
        setReviews(reviewList);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load reports.");
      }
    }

    loadReports();
  }, []);

  const revenueTrend = reports?.revenueTrend ?? [];
  const statusDistribution = reports?.statusDistribution ?? [];
  const topCars = reports?.topCars ?? [];

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
        <KpiCard label="Total revenue" value={formatCurrency(reports?.totalRevenue ?? 0)} icon={DollarSign} />
        <KpiCard label="Total bookings" value={reports?.totalBookings ?? 0} icon={CalendarRange} />
        <KpiCard label="Average booking" value={formatCurrency(reports?.averageBooking ?? 0)} icon={TrendingUp} />
        <KpiCard label="Average rating" value={(reports?.averageRating ?? 0).toFixed(1)} icon={CarIcon} />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold">Revenue & bookings trend</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer>
            <LineChart data={revenueTrend}>
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
                <Pie data={statusDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {statusDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
                    <div className="flex items-center gap-2"><div className="h-1.5 w-32 rounded-full bg-secondary"><div className="h-full rounded-full bg-accent" style={{ width: `${c.utilization}%` }} /></div><span className="text-xs text-muted-foreground">{c.utilization}%</span></div>
                  </td>
                </tr>
              ))}
              {topCars.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-muted-foreground" colSpan={4}>No car performance data yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-border p-6">
          <h2 className="text-lg font-semibold">Customer reviews</h2>
          <p className="text-xs text-muted-foreground">{reviews.length} submitted reviews</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Vehicle</th><th className="px-4 py-3">Rating</th><th className="px-4 py-3">Review</th><th className="px-4 py-3">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td className="px-4 py-3"><p className="font-semibold">{review.customerName}</p><p className="text-xs text-muted-foreground">{review.customerEmail}</p></td>
                  <td className="px-4 py-3 text-muted-foreground">{review.carTitle}</td>
                  <td className="px-4 py-3 font-semibold">{review.rating}/5</td>
                  <td className="max-w-md px-4 py-3 text-muted-foreground">{review.comment}</td>
                  <td className="px-4 py-3 text-muted-foreground">{review.createdAt}</td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-muted-foreground" colSpan={5}>No reviews submitted yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
