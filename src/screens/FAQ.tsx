"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const groups = [
  {
    title: "Booking",
    items: [
      ["How do I book a car?", "Browse the fleet, pick your dates and pickup location, then submit a booking request. You'll receive confirmation within an hour during business hours."],
      ["Can I modify my booking?", "Yes, you can request changes from your dashboard up to 24 hours before pickup. Our team will review and confirm."],
      ["When do I receive confirmation?", "Most requests are reviewed and confirmed within an hour. You'll receive an email and in-app notification."],
    ],
  },
  {
    title: "Payments",
    items: [
      ["When am I charged?", "You're only charged after your booking is approved by our team. The security deposit is held separately and released after return."],
      ["What payment methods do you accept?", "We accept all major credit and debit cards, plus Apple Pay and Google Pay."],
      ["Is the security deposit refundable?", "Yes — it's released back to your card within 5 business days of returning the vehicle in original condition."],
    ],
  },
  {
    title: "Cancellation",
    items: [
      ["What's your cancellation policy?", "Free cancellation up to 24 hours before pickup. After that, a 25% fee applies. No-shows are charged the full first day."],
      ["How do I cancel?", "Open your booking from your dashboard and tap Cancel. You'll receive a confirmation email immediately."],
    ],
  },
  {
    title: "Rental Terms",
    items: [
      ["What's the minimum age?", "Drivers must be at least 21 years old. Some premium and sports vehicles require drivers to be 25+."],
      ["Is insurance included?", "Yes, comprehensive insurance and 24/7 roadside assistance are included with every booking."],
      ["What about fuel?", "Vehicles are delivered with a full tank and should be returned the same way to avoid refueling fees."],
    ],
  },
  {
    title: "Account",
    items: [
      ["How do I create an account?", "Tap 'Get started' and provide your name, email, and phone. Verification takes about a minute."],
      ["I forgot my password", "Use the 'Forgot password' link on the sign-in page. We'll send a reset link to your email."],
    ],
  },
];

export default function FAQ() {
  return (
    <section className="container-px mx-auto max-w-4xl py-16">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">Help center</p>
        <h1 className="mt-3 font-display text-4xl font-bold">Frequently asked questions</h1>
        <p className="mt-3 text-muted-foreground">Everything you need to know about renting with DriveFlow.</p>
      </div>

      <div className="mt-12 space-y-10">
        {groups.map((g) => (
          <div key={g.title}>
            <h2 className="text-xl font-semibold">{g.title}</h2>
            <Accordion type="single" collapsible className="mt-3 space-y-2">
              {g.items.map(([q, a], i) => (
                <AccordionItem key={i} value={`${g.title}-${i}`} className="card-elevated rounded-xl border-border px-5">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">{q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </section>
  );
}
