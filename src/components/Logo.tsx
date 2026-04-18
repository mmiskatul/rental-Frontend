import { Link } from "react-router-dom";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, variant = "default" }: { className?: string; variant?: "default" | "light" }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2 font-display font-bold text-lg", className)}>
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          variant === "light" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground",
        )}
      >
        <Car className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className={variant === "light" ? "text-primary-foreground" : "text-foreground"}>
        Drive<span className="text-accent">Flow</span>
      </span>
    </Link>
  );
}
