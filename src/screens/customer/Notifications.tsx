import { useEffect, useState } from "react";
import { Bell, CheckCircle2, XCircle, Info, Calendar, KeyRound, RotateCcw, Star, ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listNotifications, markAllNotificationsRead, markNotificationRead, type AppNotification, type NotificationType } from "@/lib/notifications-api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const typeMeta: Record<NotificationType, { icon: typeof Bell; color: string; label: string }> = {
  approval: { icon: CheckCircle2, color: "text-success bg-success-soft", label: "Approvals" },
  rejected: { icon: XCircle, color: "text-destructive bg-[hsl(var(--status-rejected-bg))]", label: "Rejected" },
  reminder: { icon: Calendar, color: "text-warning bg-warning-soft", label: "Reminders" },
  system: { icon: Info, color: "text-info bg-info-soft", label: "System" },
  booking: { icon: ClipboardList, color: "text-info bg-info-soft", label: "Bookings" },
  pickup: { icon: KeyRound, color: "text-warning bg-warning-soft", label: "Pickup" },
  return: { icon: RotateCcw, color: "text-success bg-success-soft", label: "Return" },
  review: { icon: Star, color: "text-accent bg-accent-soft", label: "Reviews" },
};

export default function Notifications() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const list = filter === "all" ? notifications : filter === "unread" ? notifications.filter((n) => !n.read) : notifications.filter((n) => n.type === filter);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setIsLoading(true);
    try {
      const data = await listNotifications();
      setNotifications(data.notifications);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load notifications.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRead(notification: AppNotification) {
    if (notification.read) return;
    try {
      const updated = await markNotificationRead(notification.id);
      setNotifications((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update notification.");
    }
  }

  async function handleReadAll() {
    try {
      await markAllNotificationsRead();
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      toast.success("Notifications marked as read");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update notifications.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Notifications</h1>
          <p className="mt-1 text-muted-foreground">{isLoading ? "Loading notifications..." : "Stay on top of your bookings and account updates."}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReadAll} disabled={!notifications.some((item) => !item.read)}>Mark all as read</Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="overflow-x-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="approval">Approvals</TabsTrigger>
          <TabsTrigger value="pickup">Pickup</TabsTrigger>
          <TabsTrigger value="return">Return</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        {list.map((n) => {
          const meta = typeMeta[n.type] ?? typeMeta.system;
          const Icon = meta.icon;
          return (
            <Card key={n.id} className={cn("flex gap-4 p-4 transition-colors hover:bg-secondary/40", !n.read && "border-l-4 border-l-accent")} onClick={() => handleRead(n)}>
              <div className={cn("flex h-10 w-10 flex-none items-center justify-center rounded-xl", meta.color)}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{n.title}</p>
                  <p className="flex-none text-xs text-muted-foreground">{n.createdAt}</p>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.description}</p>
              </div>
            </Card>
          );
        })}
        {!isLoading && list.length === 0 && (
          <Card className="p-10 text-center text-muted-foreground"><Bell className="mx-auto h-6 w-6" /><p className="mt-2">You're all caught up.</p></Card>
        )}
      </div>
    </div>
  );
}
