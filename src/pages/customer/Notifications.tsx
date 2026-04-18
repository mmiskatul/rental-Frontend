import { useState } from "react";
import { Bell, CheckCircle2, XCircle, Info, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const all = [
  { id: 1, type: "approval", icon: CheckCircle2, color: "text-success bg-success-soft", title: "Booking BK-10248 approved", desc: "Your Mercedes S-Class is ready for pickup on Apr 22.", time: "2 hours ago", read: false },
  { id: 2, type: "reminder", icon: Calendar, color: "text-warning bg-warning-soft", title: "Pickup reminder", desc: "Don't forget to pick up your Tesla Model Y tomorrow at 10am.", time: "5 hours ago", read: false },
  { id: 3, type: "system", icon: Info, color: "text-info bg-info-soft", title: "New car added near you", desc: "A Porsche 911 Carrera is now available in Las Vegas.", time: "1 day ago", read: false },
  { id: 4, type: "rejected", icon: XCircle, color: "text-destructive bg-[hsl(var(--status-rejected-bg))]", title: "Booking BK-10253 declined", desc: "The vehicle is unavailable for your selected dates.", time: "2 days ago", read: true },
  { id: 5, type: "approval", icon: CheckCircle2, color: "text-success bg-success-soft", title: "Booking BK-10254 completed", desc: "Thanks for renting with DriveFlow!", time: "5 days ago", read: true },
];

export default function Notifications() {
  const [filter, setFilter] = useState("all");
  const list = filter === "all" ? all : filter === "unread" ? all.filter((n) => !n.read) : all.filter((n) => n.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Notifications</h1>
          <p className="mt-1 text-muted-foreground">Stay on top of your bookings and account updates.</p>
        </div>
        <Button variant="outline" size="sm">Mark all as read</Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="approval">Approvals</TabsTrigger>
          <TabsTrigger value="reminder">Reminders</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        {list.map((n) => (
          <Card key={n.id} className={cn("flex gap-4 p-4 transition-colors hover:bg-secondary/40", !n.read && "border-l-4 border-l-accent")}>
            <div className={cn("flex h-10 w-10 flex-none items-center justify-center rounded-xl", n.color)}>
              <n.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold">{n.title}</p>
                <p className="flex-none text-xs text-muted-foreground">{n.time}</p>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{n.desc}</p>
            </div>
          </Card>
        ))}
        {list.length === 0 && (
          <Card className="p-10 text-center text-muted-foreground"><Bell className="mx-auto h-6 w-6" /><p className="mt-2">You're all caught up.</p></Card>
        )}
      </div>
    </div>
  );
}
