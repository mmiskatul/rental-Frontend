"use client";

import { Award, Sparkles, Users, Globe } from "lucide-react";

export default function About() {
  const stats = [
    { label: "Active customers", value: "50K+" },
    { label: "Vehicles in fleet", value: "200+" },
    { label: "Cities served", value: "24" },
    { label: "Average rating", value: "4.9★" },
  ];
  const values = [
    { icon: Sparkles, title: "Quality first", desc: "Every car is hand-picked, professionally maintained, and inspected after each booking." },
    { icon: Users, title: "Customer obsessed", desc: "We design every interaction around what's actually useful to drivers — not what's easiest for us." },
    { icon: Globe, title: "Built to scale", desc: "From local rentals to nationwide trips, our platform delivers a consistent premium experience." },
    { icon: Award, title: "Trust & transparency", desc: "No hidden fees, no surprises. The price you see is what you pay, every time." },
  ];

  return (
    <>
      <section className="bg-gradient-surface py-20">
        <div className="container-px mx-auto max-w-4xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-accent">About DriveFlow</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Mobility, reimagined.</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            DriveFlow was founded to fix what's broken about car rentals: opaque pricing, tired vehicles, and clunky booking experiences. We're building the rental platform we always wished existed.
          </p>
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card-elevated p-6 text-center">
              <p className="font-display text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl pb-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="font-display text-3xl font-bold">Our mission</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              To make premium mobility accessible, transparent, and effortless for every driver. We believe renting a car should feel as polished as the cars themselves — clear pricing, immaculate vehicles, and service that genuinely cares.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              From weekend escapes to business travel, our team and our platform exist to give you back time, peace of mind, and the simple joy of a great drive.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="card-elevated p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent"><v.icon className="h-5 w-5" /></div>
                <h3 className="mt-4 font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
