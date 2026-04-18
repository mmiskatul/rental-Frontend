import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 hero-gradient lg:flex lg:flex-col lg:justify-between p-12 text-primary-foreground">
        <Logo variant="light" />
        <div className="max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight">
            Drive premium. <br />
            Book in minutes.
          </h2>
          <p className="mt-4 text-primary-foreground/70">
            Join thousands who trust DriveFlow for transparent pricing, a curated fleet, and a frictionless booking
            experience.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm text-primary-foreground/80">
            <ShieldCheck className="h-5 w-5 text-accent" />
            Trusted by 50,000+ drivers worldwide
          </div>
        </div>
        <p className="text-xs text-primary-foreground/50">© {new Date().getFullYear()} DriveFlow Inc.</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex justify-center"><Logo /></div>
          <Card className="border-border p-7 shadow-elevated">
            <h1 className="font-display text-2xl font-bold">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </Card>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">← Back to website</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
