import { useState } from "react";
import { Search, Mail, Phone, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { customers, formatCurrency, type Customer } from "@/lib/mock-data";

export default function AdminCustomers() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const list = customers.filter((c) => `${c.name} ${c.email}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Customers</h1>
        <p className="mt-1 text-muted-foreground">{customers.length} registered customers</p>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customers…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Bookings</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Total spend</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{c.name.split(" ").map((p) => p[0]).join("")}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.joinedAt}</td>
                  <td className="px-4 py-3 font-semibold">{c.totalBookings}</td>
                  <td className="px-4 py-3">{c.activeBookings}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(c.totalSpend)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.status === "active" ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(c)}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader><SheetTitle>Customer profile</SheetTitle></SheetHeader>
          {selected && (
            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14"><AvatarFallback className="bg-primary text-primary-foreground">{selected.name.split(" ").map((p) => p[0]).join("")}</AvatarFallback></Avatar>
                <div>
                  <p className="text-lg font-semibold">{selected.name}</p>
                  <p className="text-xs text-muted-foreground">Customer since {selected.joinedAt}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-border p-3"><p className="text-xl font-bold">{selected.totalBookings}</p><p className="text-[10px] text-muted-foreground">Bookings</p></div>
                <div className="rounded-xl border border-border p-3"><p className="text-xl font-bold">{selected.activeBookings}</p><p className="text-[10px] text-muted-foreground">Active</p></div>
                <div className="rounded-xl border border-border p-3"><p className="text-xl font-bold">{formatCurrency(selected.totalSpend)}</p><p className="text-[10px] text-muted-foreground">Spent</p></div>
              </div>
              <div className="space-y-2 rounded-xl border border-border p-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {selected.email}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {selected.phone}</div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
