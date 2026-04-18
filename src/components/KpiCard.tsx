import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive?: boolean };
  iconClassName?: string;
}

export function KpiCard({ label, value, icon: Icon, trend, iconClassName }: KpiCardProps) {
  return (
    <div className="card-elevated p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p
              className={cn(
                "mt-1.5 inline-flex items-center gap-1 text-xs font-medium",
                trend.positive ? "text-success" : "text-destructive",
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent", iconClassName)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
