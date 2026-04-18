import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Heart,
  Bell,
  User,
  Search,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const customerNav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/bookings", label: "My Bookings", icon: CalendarCheck },
  { to: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

export function CustomerLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-card transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Logo />
          <button className="lg:hidden" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {customerNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.to === "/dashboard/notifications" && (
                <Badge className="ml-auto bg-accent text-accent-foreground hover:bg-accent">3</Badge>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-3">
          <Button asChild variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
            <Link to="/"><LogOut className="h-4 w-4" /> Sign out</Link>
          </Button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-foreground/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search bookings, cars…" className="pl-9 bg-secondary/60 border-transparent" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link to="/dashboard/notifications">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
              </Link>
            </Button>
            <Link to="/dashboard/profile" className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-secondary">
              <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground text-xs">OM</AvatarFallback></Avatar>
              <span className="hidden text-sm font-medium sm:inline">Olivia M.</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
