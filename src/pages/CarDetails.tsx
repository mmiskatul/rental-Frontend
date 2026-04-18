import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Heart, Share2, MapPin, Fuel, Cog, Users, Briefcase, Calendar as CalIcon,
  ShieldCheck, Phone, MessageCircle, Star, ChevronLeft, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarCard } from "@/components/CarCard";
import { cars, getCar, formatCurrency } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CarDetails() {
  const { id } = useParams();
  const car = getCar(id ?? "") ?? cars[0];
  const [activeImg, setActiveImg] = useState(0);
  const [days, setDays] = useState(3);
  const [fav, setFav] = useState(false);

  const subtotal = car.pricePerDay * days;
  const fees = Math.round(subtotal * 0.08);
  const total = subtotal + fees;

  const similar = cars.filter((c) => c.id !== car.id && c.type === car.type).slice(0, 3);

  return (
    <div className="container-px mx-auto max-w-7xl py-8">
      <Link to="/cars" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to fleet
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Left: Gallery + details */}
        <div>
          <div className="overflow-hidden rounded-2xl bg-secondary">
            <img src={car.gallery[activeImg]} alt={car.name} className="aspect-[16/10] w-full object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {car.gallery.map((g, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={cn("overflow-hidden rounded-xl border-2 bg-secondary", activeImg === i ? "border-accent" : "border-transparent")}
              >
                <img src={g} alt="" className="aspect-[16/10] w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{car.type} · {car.brand}</p>
              <h1 className="mt-1 font-display text-3xl font-bold">{car.name}</h1>
              <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-accent text-accent" /> {car.rating} ({car.reviews} reviews)</div>
                <span>·</span>
                <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {car.location}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setFav(!fav)}>
                <Heart className={cn("h-4 w-4", fav && "fill-destructive text-destructive")} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => toast.success("Link copied")}><Share2 className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Specs */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Cog, label: "Transmission", value: car.transmission },
              { icon: Fuel, label: "Fuel", value: car.fuel },
              { icon: Users, label: "Seats", value: `${car.seats}` },
              { icon: Briefcase, label: "Luggage", value: `${car.luggage} bags` },
            ].map((s) => (
              <div key={s.label} className="card-elevated p-4">
                <s.icon className="h-5 w-5 text-accent" />
                <p className="mt-2 text-xs text-muted-foreground">{s.label}</p>
                <p className="text-sm font-semibold">{s.value}</p>
              </div>
            ))}
          </div>

          <Tabs defaultValue="overview" className="mt-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="terms">Rental Terms</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-5">
              <p className="text-muted-foreground leading-relaxed">{car.description}</p>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <DetailItem label="Year" value={`${car.year}`} />
                <DetailItem label="Mileage" value={car.mileage} />
                <DetailItem label="Color" value={car.color} />
                <DetailItem label="Pickup" value={car.pickupPoint} />
              </div>
            </TabsContent>
            <TabsContent value="features" className="mt-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {car.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="terms" className="mt-5 space-y-3 text-sm text-muted-foreground">
              <p>• Driver must be at least 21 years old with a valid license.</p>
              <p>• Security deposit of {formatCurrency(car.deposit)} is held during the rental period.</p>
              <p>• Free cancellation up to 24 hours before pickup.</p>
              <p>• Comprehensive insurance and 24/7 roadside assistance included.</p>
              <p>• Vehicle returned with same fuel level. Late returns charged hourly.</p>
            </TabsContent>
          </Tabs>

          {/* Similar */}
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold">Similar vehicles</h2>
            <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => <CarCard key={s.id} car={s} />)}
            </div>
          </div>
        </div>

        {/* Right: Booking card */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Card className="border-border p-6 shadow-elevated">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-3xl font-bold">{formatCurrency(car.pricePerDay)}<span className="text-base font-normal text-muted-foreground">/day</span></p>
                <p className="text-xs text-muted-foreground">incl. taxes</p>
              </div>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", car.available ? "bg-success-soft text-success" : "bg-muted text-muted-foreground")}>
                {car.available ? "Available" : "Unavailable"}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Pick-up</Label>
                  <div className="relative">
                    <CalIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="date" className="pl-9" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Drop-off</Label>
                  <div className="relative">
                    <CalIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="date" className="pl-9" />
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-xs">Pick-up Location</Label>
                <Select defaultValue={car.pickupPoint}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={car.pickupPoint}>{car.pickupPoint}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Rental period</Label>
                <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 7, 14].map((d) => <SelectItem key={d} value={String(d)}>{d} days</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <Row label={`${formatCurrency(car.pricePerDay)} × ${days} days`} value={formatCurrency(subtotal)} />
              <Row label="Service fee" value={formatCurrency(fees)} />
              <Row label="Security deposit (refundable)" value={formatCurrency(car.deposit)} muted />
              <div className="flex items-center justify-between border-t border-border pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button className="mt-5 w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" disabled={!car.available} onClick={() => toast.success("Booking request sent! Awaiting approval.")}>
              Request Booking
            </Button>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-secondary/60 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-success" />
              <span>You won't be charged yet. Final charge happens after admin approval.</span>
            </div>
          </Card>

          <Card className="mt-4 border-border p-5">
            <p className="text-sm font-semibold">Need help?</p>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1"><Phone className="mr-2 h-3.5 w-3.5" /> Call</Button>
              <Button variant="outline" size="sm" className="flex-1"><MessageCircle className="mr-2 h-3.5 w-3.5" /> Chat</Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}
function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between", muted && "text-muted-foreground")}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}
