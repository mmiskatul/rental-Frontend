import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Check, X, Phone, Mail, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { bookings, getCar, formatCurrency, customers } from "@/lib/mock-data";
import { toast } from "sonner";

const history = [
  { label: "Request submitted by customer", time: "Apr 15, 10:24 AM" },
  { label: "Admin reviewing", time: "Apr 15, 10:31 AM" },
  { label: "Approved by Alex Drew", time: "Apr 15, 11:02 AM" },
];

export default function AdminBookingDetails() {
  const params = useParams();
  const rawId = params?.id;
  const bookingId = Array.isArray(rawId) ? rawId[0] : rawId;
  const b = bookings.find((x) => x.id === bookingId) ?? bookings[0];
  const car = getCar(b.carId);
  const customer = customers.find((c) => c.email === b.customerEmail);

  return (
    <div className="space-y-6">
      <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to bookings
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Booking {b.id}</p>
          <h1 className="mt-1 font-display text-2xl font-bold">{car?.name}</h1>
        </div>
        <StatusBadge status={b.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Booking summary</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
              <Detail label="Pick-up" value={b.startDate} />
              <Detail label="Drop-off" value={b.endDate} />
              <Detail label="Days" value={String(b.days)} />
              <Detail label="Location" value={b.pickupLocation} />
            </div>
          </Card>

          <Card className="overflow-hidden">
            <img src={car?.image} alt="" className="aspect-[16/6] w-full object-cover" />
            <div className="p-6">
              <h2 className="text-lg font-semibold">Vehicle</h2>
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
                <Detail label="Brand" value={car?.brand ?? ""} />
                <Detail label="Type" value={car?.type ?? ""} />
                <Detail label="Reg." value={car?.registration ?? ""} />
                <Detail label="Daily price" value={formatCurrency(car?.pricePerDay ?? 0)} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Booking history</h2>
            <div className="mt-4 space-y-3">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <p className="flex-1 text-sm">{h.label}</p>
                  <p className="text-xs text-muted-foreground">{h.time}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Internal notes</h2>
            <Textarea rows={4} className="mt-3" placeholder="Add a private note for the team…" defaultValue={b.notes ?? ""} />
            <Button size="sm" className="mt-3" onClick={() => toast.success("Note saved")}>Save note</Button>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Customer</h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar className="h-12 w-12"><AvatarFallback className="bg-primary text-primary-foreground">{b.customerName.split(" ").map((p) => p[0]).join("")}</AvatarFallback></Avatar>
              <div>
                <p className="font-semibold">{b.customerName}</p>
                <p className="text-xs text-muted-foreground">{customer?.totalBookings ?? 1} total bookings</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {b.customerEmail}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {b.customerPhone}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1"><Mail className="mr-2 h-3.5 w-3.5" /> Email</Button>
              <Button variant="outline" size="sm" className="flex-1"><MessageSquare className="mr-2 h-3.5 w-3.5" /> Message</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Pricing</h2>
            <div className="mt-3 space-y-1.5 text-sm">
              <Row label={`${formatCurrency(car?.pricePerDay ?? 0)} × ${b.days} days`} value={formatCurrency((car?.pricePerDay ?? 0) * b.days)} />
              <Row label="Service fee" value={formatCurrency(Math.round(b.total * 0.08))} />
              <Row label="Deposit" value={formatCurrency(car?.deposit ?? 0)} muted />
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{formatCurrency(b.total)}</span></div>
            </div>
          </Card>

          {b.status === "pending" && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Decision</h2>
              <div className="mt-4 space-y-2">
                <Button className="w-full bg-success hover:bg-success/90 text-success-foreground" onClick={() => toast.success("Booking approved")}><Check className="mr-2 h-4 w-4" /> Approve</Button>
                <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={() => toast.success("Booking rejected")}><X className="mr-2 h-4 w-4" /> Reject</Button>
              </div>
            </Card>
          )}

          {(b.status === "approved" || b.status === "active") && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Update status</h2>
              <div className="mt-4 space-y-2">
                {b.status === "approved" && <Button className="w-full" onClick={() => toast.success("Marked active")}>Mark as active</Button>}
                {b.status === "active" && <Button className="w-full" onClick={() => toast.success("Marked completed")}>Mark as completed</Button>}
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
function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return <div className={`flex justify-between ${muted ? "text-muted-foreground" : ""}`}><span>{label}</span><span>{value}</span></div>;
}
