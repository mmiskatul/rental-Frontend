import Link from "next/link";
import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  Clock,
  Star,
  CheckCircle2,
  Car as CarIcon,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CarCard } from "@/components/CarCard";
import { cars } from "@/lib/mock-data";
import heroCar from "@/assets/hero-car.jpg";

const benefits = [
  { icon: ShieldCheck, title: "Fully Insured", desc: "Every rental is covered with comprehensive insurance and 24/7 roadside assistance." },
  { icon: Sparkles, title: "Premium Fleet", desc: "Hand-curated vehicles, professionally cleaned and inspected after every booking." },
  { icon: HeartHandshake, title: "Transparent Pricing", desc: "No hidden fees. The price you see is the price you pay — every single time." },
  { icon: Clock, title: "Instant Confirmation", desc: "Most booking requests are reviewed and approved within an hour by our team." },
];

const steps = [
  { n: "01", title: "Browse the fleet", desc: "Filter by city, dates, type and budget to find your perfect vehicle." },
  { n: "02", title: "Send a request", desc: "Pick your dates and submit a booking request in under a minute." },
  { n: "03", title: "Get approved", desc: "Our team reviews and confirms your booking — usually within the hour." },
  { n: "04", title: "Pick up & drive", desc: "Collect your car at the agreed location and enjoy a premium ride." },
];

const categories = [
  { type: "Luxury", count: 24 },
  { type: "SUV", count: 38 },
  { type: "Electric", count: 19 },
  { type: "Sports", count: 12 },
  { type: "Sedan", count: 32 },
  { type: "Compact", count: 28 },
];

const testimonials = [
  { name: "Olivia Martinez", role: "Frequent Traveler", quote: "DriveFlow has completely changed how I rent cars. The fleet is immaculate and the booking process is genuinely effortless.", rating: 5 },
  { name: "James Wilson", role: "Business Executive", quote: "Reliable, premium, and incredibly easy. I now use DriveFlow for every business trip — the consistency is unmatched.", rating: 5 },
  { name: "Sophia Chen", role: "Designer", quote: "The cars feel hand-picked. Every detail of the experience reflects real care, from the website to the keys in hand.", rating: 5 },
];

const faqs = [
  { q: "How quickly are bookings approved?", a: "Most booking requests are reviewed and confirmed within one hour during business hours." },
  { q: "What's included in the rental price?", a: "Insurance, 24/7 roadside assistance, unlimited mileage on most vehicles, and a full tank of fuel." },
  { q: "Can I cancel my booking?", a: "Yes — cancellations are free up to 24 hours before pickup. See our policy for details." },
];

export default function Index() {
  const featured = cars.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-surface">
        <div className="container-px mx-auto grid max-w-7xl items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Now serving 24 cities
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Premium cars,<br />
              <span className="text-gradient-accent">effortless</span> rentals.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              DriveFlow is the modern way to rent a car. A curated premium fleet, transparent pricing, and a seamless booking experience — built for how you actually travel.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow">
                <Link href="/cars">Book a Car <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/cars">Explore Fleet</Link>
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div>
                <p className="text-2xl font-bold text-foreground">50K+</p>
                <p>Happy renters</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">200+</p>
                <p>Premium vehicles</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">4.9★</p>
                <p>Average rating</p>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-accent opacity-10 blur-3xl" />
            <img
              src={heroCar.src}
              alt="Premium luxury rental sedan in midnight blue"
              width={1920}
              height={1080}
              className="relative rounded-3xl object-cover shadow-premium"
            />
          </div>
        </div>

        {/* Smart Search Bar */}
        <div className="container-px mx-auto max-w-7xl pb-16">
          <div className="card-elevated relative -mt-4 grid gap-3 p-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:p-3">
            <SearchField icon={MapPin} label="Pick-up location" placeholder="Enter city or airport" />
            <SearchField icon={Calendar} label="Pick-up date" placeholder="Select date" />
            <SearchField icon={Calendar} label="Drop-off date" placeholder="Select date" />
            <Button asChild size="lg" className="h-auto bg-primary px-8 hover:bg-primary-glow">
              <Link href="/cars"><Search className="mr-2 h-4 w-4" /> Search Cars</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-px mx-auto max-w-7xl py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-accent">Browse by category</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Find the perfect ride</h2>
          </div>
          <Button asChild variant="ghost" className="hidden sm:flex">
            <Link href="/cars">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.type}
              href="/cars"
              className="card-elevated group flex flex-col items-center gap-2 p-5 text-center hover:border-accent"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary group-hover:bg-accent-soft">
                <CarIcon className="h-5 w-5 text-foreground" />
              </div>
              <p className="text-sm font-semibold">{c.type}</p>
              <p className="text-xs text-muted-foreground">{c.count} vehicles</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="container-px mx-auto max-w-7xl py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-accent">Featured vehicles</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Trending this week</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/cars">Browse all cars</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((car) => <CarCard key={car.id} car={car} />)}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/40 py-20">
        <div className="container-px mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-accent">How it works</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Drive in 4 simple steps</h2>
            <p className="mt-3 text-muted-foreground">From browsing the fleet to picking up the keys — we've simplified every step.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="card-elevated p-6">
                <span className="font-display text-3xl font-bold text-accent">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="container-px mx-auto max-w-7xl py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-accent">Why DriveFlow</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Built for drivers who expect more</h2>
            <p className="mt-4 text-muted-foreground">
              We obsess over every detail — from the cars we choose to the moment you return the keys. The result is a rental experience that feels effortless from start to finish.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Curated fleet with strict quality standards",
                "Flexible cancellation up to 24h before pickup",
                "Dedicated support team, 7 days a week",
                "Loyalty rewards for repeat customers",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-success" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((b) => (
              <div key={b.title} className="card-elevated p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{b.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/40 py-20">
        <div className="container-px mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-accent">Loved by drivers</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">What our customers say</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card-elevated p-6">
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed">"{t.quote}"</p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="container-px mx-auto max-w-4xl py-20">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-accent">Frequently asked</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Everything you need to know</h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="card-elevated group p-5">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold">
                {f.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline"><Link href="/faq">View all FAQs</Link></Button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-px mx-auto max-w-7xl pb-20">
        <div className="hero-gradient relative overflow-hidden rounded-3xl p-10 text-primary-foreground sm:p-16">
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready for your next drive?</h2>
            <p className="mt-3 text-primary-foreground/70">Browse the fleet, request a booking, and we'll have your keys ready when you arrive.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/cars">Book a Car</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/register">Create account</Link>
              </Button>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        </div>
      </section>
    </>
  );
}

function SearchField({ icon: Icon, label, placeholder }: { icon: LucideIcon; label: string; placeholder: string }) {
  return (
    <div className="rounded-xl border border-transparent bg-secondary/40 px-4 py-2.5 transition-colors focus-within:border-accent focus-within:bg-background">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <Input placeholder={placeholder} className="h-7 border-none bg-transparent p-0 shadow-none focus-visible:ring-0" />
      </div>
    </div>
  );
}
