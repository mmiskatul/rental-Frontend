import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Profile settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your personal info, security and preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card className="p-6 text-center">
          <Avatar className="mx-auto h-20 w-20"><AvatarFallback className="bg-primary text-primary-foreground text-xl">OM</AvatarFallback></Avatar>
          <p className="mt-4 font-semibold">Olivia Martinez</p>
          <p className="text-xs text-muted-foreground">olivia.m@example.com</p>
          <Separator className="my-4" />
          <div className="grid grid-cols-3 gap-2 text-center">
            <div><p className="text-lg font-bold">14</p><p className="text-[10px] text-muted-foreground">Bookings</p></div>
            <div><p className="text-lg font-bold">$8.4K</p><p className="text-[10px] text-muted-foreground">Spent</p></div>
            <div><p className="text-lg font-bold">4.9★</p><p className="text-[10px] text-muted-foreground">Rating</p></div>
          </div>
          <Button variant="outline" size="sm" className="mt-5 w-full">Change photo</Button>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Personal information</h2>
            <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated"); }}>
              <div><Label>First name</Label><Input defaultValue="Olivia" /></div>
              <div><Label>Last name</Label><Input defaultValue="Martinez" /></div>
              <div><Label>Email</Label><Input type="email" defaultValue="olivia.m@example.com" /></div>
              <div><Label>Phone</Label><Input defaultValue="+1 (212) 555-0142" /></div>
              <div className="sm:col-span-2"><Label>Address</Label><Input defaultValue="350 5th Ave, New York, NY" /></div>
              <div className="sm:col-span-2 flex justify-end"><Button type="submit" className="bg-primary hover:bg-primary-glow">Save changes</Button></div>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Security</h2>
            <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast.success("Password updated"); }}>
              <div className="sm:col-span-2"><Label>Current password</Label><Input type="password" /></div>
              <div><Label>New password</Label><Input type="password" /></div>
              <div><Label>Confirm new password</Label><Input type="password" /></div>
              <div className="sm:col-span-2 flex justify-end"><Button type="submit" variant="outline">Update password</Button></div>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Preferences</h2>
            <div className="mt-4 space-y-4">
              {[
                { label: "Booking confirmations", desc: "Email & in-app notifications when status changes" },
                { label: "Promotional emails", desc: "New cars, discounts, and seasonal offers" },
                { label: "SMS reminders", desc: "Pickup and return reminders via SMS" },
              ].map((p, i) => (
                <div key={i} className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                  <Switch defaultChecked={i !== 1} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
