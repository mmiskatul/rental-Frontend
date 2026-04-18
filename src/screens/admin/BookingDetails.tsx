import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Check, X, Phone, Mail, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, type Booking, type BookingStatus } from "@/lib/mock-data";
import { getBooking, updateBookingStatus } from "@/lib/bookings-api";
import { toast } from "sonner";

type AdminBooking = Booking & { carName?: string; carImage?: string | null };

export default function AdminBookingDetails() {
  const params = useParams();
  const rawId = params?.id;
  const bookingId = Array.isArray(rawId) ? rawId[0] : rawId;
  const [booking, setBooking] = useState<AdminBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadBooking() {
      if (!bookingId) return;
      setIsLoading(true);
      try {
        const loaded = await getBooking(bookingId);
        if (mounted) setBooking(loaded);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load booking.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadBooking();

    return () => {
      mounted = false;
    };
  }, [bookingId]);

  async function handleStatus(status: BookingStatus) {
    if (!booking) return;
    try {
      const updated = await updateBookingStatus(booking.id, status);
      setBooking(updated);
      toast.success(status === "approved" ? "Booking approved" : "Booking rejected");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update booking.");
    }
  }

  if (isLoading) {
    return <div className="h-[420px] rounded-lg bg-secondary/70" />;
  }

  if (!booking) {
    return (
      <div className="space-y-6">
        <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Back to bookings
        </Link>
        <Card className="p-8 text-center text-muted-foreground">Booking not found.</Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to bookings
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Booking {booking.id}</p>
          <h1 className="mt-1 font-display text-2xl font-bold">{booking.carName}</h1>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Booking summary</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <Detail label="Pick-up" value={booking.startDate} />
              <Detail label="Drop-off" value={booking.endDate} />
              <Detail label="Days" value={String(booking.days)} />
              <Detail label="Location" value={booking.pickupLocation} />
            </div>
          </Card>

          <Card className="overflow-hidden">
            {booking.carImage ? <img src={booking.carImage} alt="" className="aspect-[16/6] w-full object-cover" /> : <div className="aspect-[16/6] w-full bg-secondary" />}
            <div className="p-6">
              <h2 className="text-lg font-semibold">Vehicle</h2>
              <p className="mt-2 text-sm text-muted-foreground">{booking.carName}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Booking history</h2>
            <div className="mt-4 space-y-3">
              <HistoryItem label="Request submitted by customer" time={booking.createdAt} />
              <HistoryItem label={`Current status: ${booking.status}`} time={booking.createdAt} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Internal notes</h2>
            <Textarea rows={4} className="mt-3" placeholder="Add a private note for the team..." defaultValue={booking.notes ?? ""} />
            <Button size="sm" className="mt-3" onClick={() => toast.success("Note saved")}>Save note</Button>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Customer</h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar className="h-12 w-12"><AvatarFallback className="bg-primary text-primary-foreground">{getInitials(booking.customerName)}</AvatarFallback></Avatar>
              <div>
                <p className="font-semibold">{booking.customerName}</p>
                <p className="text-xs text-muted-foreground">Customer request</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {booking.customerEmail}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {booking.customerPhone || "No phone added"}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1"><Mail className="mr-2 h-3.5 w-3.5" /> Email</Button>
              <Button variant="outline" size="sm" className="flex-1"><MessageSquare className="mr-2 h-3.5 w-3.5" /> Message</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Pricing</h2>
            <div className="mt-3 space-y-1.5 text-sm">
              <Row label="Booking total" value={formatCurrency(booking.total)} />
              <Row label="Payment status" value={booking.paymentStatus} muted />
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{formatCurrency(booking.total)}</span></div>
            </div>
          </Card>

          {booking.status === "pending" && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Decision</h2>
              <div className="mt-4 space-y-2">
                <Button className="w-full bg-success hover:bg-success/90 text-success-foreground" onClick={() => handleStatus("approved")}><Check className="mr-2 h-4 w-4" /> Approve</Button>
                <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={() => handleStatus("rejected")}><X className="mr-2 h-4 w-4" /> Reject</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (<div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-0.5 text-sm font-semibold">{value}</p></div>);
}

function HistoryItem({ label, time }: { label: string; time: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border p-3">
      <span className="h-2 w-2 rounded-full bg-success" />
      <p className="flex-1 text-sm">{label}</p>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return <div className={`flex justify-between ${muted ? "text-muted-foreground" : ""}`}><span>{label}</span><span>{value}</span></div>;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
