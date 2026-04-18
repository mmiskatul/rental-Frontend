import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  CalendarRange,
  Users,
  BarChart3,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const adminNav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/cars", label: "Fleet", icon: Car },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarRange, badge: "4" },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <Logo variant="light" />
          <button className="text-sidebar-foreground lg:hidden" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <div className="px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">Admin Portal</p>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.badge && (
                <Badge className="ml-auto bg-accent text-accent-foreground hover:bg-accent">{item.badge}</Badge>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-3">
          <Button asChild variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground">
            <Link to="/"><LogOut className="h-4 w-4" /> Sign out</Link>
          </Button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-foreground/40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search cars, bookings, customers…" className="pl-9 bg-secondary/60 border-transparent" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
            </Button>
            <div className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-secondary">
              <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground text-xs">AD</AvatarFallback></Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-tight">Alex Drew</p>
                <p className="text-[10px] text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
