"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/cars", label: "Fleet" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function PublicNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dashboardHref = user?.role === "admin" ? "/admin" : "/dashboard";

  async function handleLogout() {
    await logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 glass">
      <nav className="container-px mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === l.to
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button asChild size="sm" className="bg-primary hover:bg-primary-glow">
                <Link href={dashboardHref}>Dashboard</Link>
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            !isLoading && (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary hover:bg-primary-glow">
                  <Link href="/register">Get started</Link>
                </Button>
              </>
            )
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container-px mx-auto flex max-w-7xl flex-col gap-1 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  pathname === l.to ? "bg-secondary text-foreground" : "text-muted-foreground",
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-border pt-3">
              {user ? (
                <>
                  <Button asChild size="sm" className="flex-1">
                    <Link href={dashboardHref} onClick={() => setOpen(false)}>Dashboard</Link>
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="flex-1" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                !isLoading && (
                  <>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href="/login" onClick={() => setOpen(false)}>Sign in</Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1">
                      <Link href="/register" onClick={() => setOpen(false)}>Get started</Link>
                    </Button>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
