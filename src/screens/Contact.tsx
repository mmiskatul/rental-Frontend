"use client";

import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Contact() {
  return (
    <section className="container-px mx-auto max-w-7xl py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">Contact us</p>
        <h1 className="mt-3 font-display text-4xl font-bold">We're here to help</h1>
        <p className="mt-4 text-muted-foreground">Reach out to our team — we typically reply within an hour during business hours.</p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          {[
            { icon: Phone, label: "Phone", value: "+1 (800) 555-0199", desc: "Mon–Sun, 7am–11pm ET" },
            { icon: Mail, label: "Email", value: "support@driveflow.com", desc: "We reply within 1 hour" },
            { icon: MapPin, label: "HQ", value: "350 5th Ave, New York, NY", desc: "Open for visitors by appointment" },
            { icon: MessageCircle, label: "Live chat", value: "Available in-app", desc: "Tap the chat icon to start" },
          ].map((c) => (
            <Card key={c.label} className="p-5">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-accent-soft text-accent"><c.icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  <p className="mt-0.5 font-semibold">{c.value}</p>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold">Send us a message</h2>
          <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast.success("Message sent — we'll be in touch soon."); }}>
            <div>
              <Label>First name</Label>
              <Input placeholder="Olivia" />
            </div>
            <div>
              <Label>Last name</Label>
              <Input placeholder="Martinez" />
            </div>
            <div className="sm:col-span-2">
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" />
            </div>
            <div className="sm:col-span-2">
              <Label>Subject</Label>
              <Input placeholder="How can we help?" />
            </div>
            <div className="sm:col-span-2">
              <Label>Message</Label>
              <Textarea rows={5} placeholder="Tell us more…" />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">Send message</Button>
            </div>
          </form>
        </Card>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-border">
        <div className="aspect-[21/7] w-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-muted-foreground">
          <MapPin className="mr-2 h-5 w-5" /> Map placeholder
        </div>
      </div>
    </section>
  );
}
