import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Eye, Check, X, KeyRound, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, type Booking, type BookingStatus } from "@/lib/mock-data";
import { confirmReturn, listBookings, requestPickup, updateBookingStatus } from "@/lib/bookings-api";
import { toast } from "sonner";

const tabs: ("all" | BookingStatus)[] = ["all", "pending", "approved", "pickup_requested", "active", "return_requested", "completed", "rejected", "cancelled"];
type AdminBooking = Booking & { carName?: string; carImage?: string | null };

export default function AdminBookings() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<string>("all");
  const [payment, setPayment] = useState<string>("all");
  const [q, setQ] = useState("");
  const list = bookings.filter((b) => {
    if (tab !== "all" && b.status !== tab) return false;
    if (payment !== "all" && b.paymentStatus !== payment) return false;
    if (q && !`${b.id} ${b.customerName} ${b.customerEmail} ${b.carName ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setIsLoading(true);
    try {
      setBookings(await listBookings());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load bookings.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatus(id: string, status: BookingStatus) {
    try {
      const updated = await updateBookingStatus(id, status);
      setBookings((current) => current.map((booking) => (booking.id === id ? updated : booking)));
      toast.success(status === "approved" ? "Booking approved" : "Booking rejected");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update booking.");
    }
  }

  async function handleAction(id: string, action: "pickup" | "return") {
    try {
      const updated = action === "pickup" ? await requestPickup(id) : await confirmReturn(id);
      setBookings((current) => current.map((booking) => (booking.id === id ? updated : booking)));
      toast.success(action === "pickup" ? "Pickup confirmation request sent" : "Return confirmed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update booking.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Booking management</h1>
        <p className="mt-1 text-muted-foreground">{isLoading ? "Loading booking requests..." : `Review, approve and manage ${bookings.length} bookings.`}</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by ID, customer, car..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={payment} onValueChange={setPayment}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payments</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="overflow-x-auto">{tabs.map((t) => <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>)}</TabsList>
      </Tabs>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Car</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((b) => (
                <tr key={b.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3"><p className="font-semibold">{b.id}</p><p className="text-xs text-muted-foreground">{b.createdAt}</p></td>
                  <td className="px-4 py-3"><p className="font-medium">{b.customerName}</p><p className="text-xs text-muted-foreground">{b.customerEmail}</p></td>
                  <td className="px-4 py-3 text-muted-foreground">{b.carName}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{b.startDate} - {b.endDate}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(b.total)}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {b.status === "pending" && (
                        <>
                          <Button size="icon" className="h-8 w-8 bg-success hover:bg-success/90 text-success-foreground" onClick={() => handleStatus(b.id, "approved")}><Check className="h-4 w-4" /></Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleStatus(b.id, "rejected")}><X className="h-4 w-4" /></Button>
                        </>
                      )}
                      {b.status === "approved" && (
                        <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => handleAction(b.id, "pickup")}><KeyRound className="h-3.5 w-3.5" /> Request Pickup</Button>
                      )}
                      {b.status === "return_requested" && (
                        <Button size="sm" className="h-8 gap-1 bg-success hover:bg-success/90 text-success-foreground" onClick={() => handleAction(b.id, "return")}><RotateCcw className="h-3.5 w-3.5" /> Confirm Return</Button>
                      )}
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8"><Link href={`/admin/bookings/${b.id}`}><Eye className="h-4 w-4" /></Link></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && list.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-muted-foreground" colSpan={7}>No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
