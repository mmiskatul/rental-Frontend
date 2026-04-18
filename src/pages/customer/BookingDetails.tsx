import { Link, useParams } from "react-router-dom";
import { ChevronLeft, MapPin, Calendar, Phone, MessageCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { bookings, getCar, formatCurrency } from "@/lib/mock-data";
import { toast } from "sonner";

const timeline = [
  { label: "Request submitted", done: true },
  { label: "Admin reviewing", done: true },
  { label: "Approved", done: true },
  { label: "Vehicle pickup", done: false },
  { label: "Rental active", done: false },
  { label: "Returned", done: false },
];

export default function BookingDetails() {
  const { id } = useParams();
  const booking = bookings.find((b) => b.id === id) ?? bookings[0];
  const car = getCar(booking.carId);

  return (
    <div className="space-y-6">
      <Link to="/dashboard/bookings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to bookings
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Booking {booking.id}</p>
          <h1 className="mt-1 font-display text-2xl font-bold">{car?.name}</h1>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <img src={car?.image} alt="" className="aspect-[16/7] w-full object-cover" />
            <div className="p-6">
              <h2 className="text-lg font-semibold">Vehicle</h2>
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Type</p><p className="font-semibold">{car?.type}</p></div>
                <div><p className="text-xs text-muted-foreground">Brand</p><p className="font-semibold">{car?.brand}</p></div>
                <div><p className="text-xs text-muted-foreground">Transmission</p><p className="font-semibold">{car?.transmission}</p></div>
                <div><p className="text-xs text-muted-foreground">Fuel</p><p className="font-semibold">{car?.fuel}</p></div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Rental period & pickup</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Detail icon={Calendar} label="Pick-up" value={booking.startDate} />
              <Detail icon={Calendar} label="Drop-off" value={booking.endDate} />
              <Detail icon={MapPin} label="Pick-up location" value={booking.pickupLocation} />
              <Detail icon={MapPin} label="Drop-off location" value={booking.pickupLocation} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Booking timeline</h2>
            <div className="mt-5 space-y-4">
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full ${t.done ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground"}`}>
                      {t.done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs">{i + 1}</span>}
                    </div>
                    {i < timeline.length - 1 && <div className={`h-8 w-0.5 ${t.done ? "bg-success" : "bg-border"}`} />}
                  </div>
                  <div className="pb-1">
                    <p className={`text-sm font-medium ${t.done ? "text-foreground" : "text-muted-foreground"}`}>{t.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {booking.notes && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Customer notes</h2>
              <p className="mt-2 text-sm text-muted-foreground">{booking.notes}</p>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Payment summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <Row label={`${formatCurrency(car?.pricePerDay ?? 0)} × ${booking.days} days`} value={formatCurrency((car?.pricePerDay ?? 0) * booking.days)} />
              <Row label="Service fee" value={formatCurrency(Math.round(booking.total * 0.08))} />
              <Row label="Security deposit" value={formatCurrency(car?.deposit ?? 0)} muted />
              <Separator className="my-2" />
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span><span>{formatCurrency(booking.total)}</span>
              </div>
              <p className="pt-1 text-xs text-muted-foreground">Payment status: <span className="font-medium capitalize text-foreground">{booking.paymentStatus}</span></p>
            </div>
            {booking.status === "pending" && (
              <Button variant="outline" className="mt-5 w-full text-destructive hover:text-destructive" onClick={() => toast.success("Booking cancelled")}>
                Cancel booking
              </Button>
            )}
          </Card>

          <Card className="p-6">
            <p className="font-semibold">Need help?</p>
            <p className="mt-1 text-xs text-muted-foreground">Our support team is available 24/7.</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1"><Phone className="mr-2 h-3.5 w-3.5" /> Call</Button>
              <Button variant="outline" size="sm" className="flex-1"><MessageCircle className="mr-2 h-3.5 w-3.5" /> Chat</Button>
            </div>
          </Card>

          <div className="flex items-start gap-2 rounded-xl border border-border bg-warning-soft p-3 text-xs text-foreground">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-warning" />
            <span>Bring your driver's license and a valid credit card to pickup. Pickup time: 9am – 7pm.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border p-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return <div className={`flex justify-between ${muted ? "text-muted-foreground" : ""}`}><span>{label}</span><span>{value}</span></div>;
}
