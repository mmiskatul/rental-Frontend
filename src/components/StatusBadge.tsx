import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/lib/mock-data";

const styles: Record<BookingStatus, string> = {
  pending: "bg-warning-soft text-warning border-warning/20",
  approved: "bg-info-soft text-info border-info/20",
  rejected: "bg-[hsl(var(--status-rejected-bg))] text-destructive border-destructive/20",
  active: "bg-success-soft text-success border-success/20",
  completed: "bg-secondary text-secondary-foreground border-border",
  cancelled: "bg-muted text-muted-foreground border-border",
};

const labels: Record<BookingStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function StatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}
