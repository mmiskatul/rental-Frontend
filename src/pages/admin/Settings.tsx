import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="mt-1 text-muted-foreground">Configure your business, policies and platform preferences.</p>
      </div>

      <Tabs defaultValue="business">
        <TabsList className="overflow-x-auto">
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="booking">Booking policy</TabsTrigger>
          <TabsTrigger value="cancellation">Cancellation</TabsTrigger>
          <TabsTrigger value="pricing">Pricing rules</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Business profile</h2>
            <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast.success("Saved"); }}>
              <div><Label>Company name</Label><Input defaultValue="DriveFlow Inc." /></div>
              <div><Label>Support email</Label><Input defaultValue="support@driveflow.com" /></div>
              <div><Label>Support phone</Label><Input defaultValue="+1 (800) 555-0199" /></div>
              <div><Label>Business hours</Label><Input defaultValue="Mon–Sun, 7am–11pm ET" /></div>
              <div className="sm:col-span-2"><Label>HQ address</Label><Input defaultValue="350 5th Ave, New York, NY" /></div>
              <div className="sm:col-span-2"><Label>About</Label><Textarea rows={3} defaultValue="DriveFlow is a premium car rental platform." /></div>
              <div className="sm:col-span-2 flex justify-end"><Button type="submit" className="bg-primary hover:bg-primary-glow">Save changes</Button></div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="booking" className="mt-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-semibold">Booking policy</h2>
            {[
              { label: "Auto-approve verified customers", desc: "Skip manual review for repeat customers with 3+ completed bookings", on: false },
              { label: "Require deposit", desc: "Hold a security deposit on the customer's card", on: true },
              { label: "Allow same-day bookings", desc: "Customers can book a car for pickup the same day", on: true },
              { label: "Minimum rental period", desc: "Enforce a minimum number of rental days", on: false },
            ].map((p, i) => (
              <Row key={i} {...p} />
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="cancellation" className="mt-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Cancellation rules</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Free cancellation window (hours)</Label><Input type="number" defaultValue={24} /></div>
              <div><Label>Late cancellation fee (%)</Label><Input type="number" defaultValue={25} /></div>
              <div><Label>No-show fee</Label><Input defaultValue="100% of first day" /></div>
              <div><Label>Refund processing time</Label><Input defaultValue="5 business days" /></div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Pricing rules</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Service fee (%)</Label><Input type="number" defaultValue={8} /></div>
              <div><Label>Tax rate (%)</Label><Input type="number" defaultValue={9} /></div>
              <div><Label>Weekly discount (%)</Label><Input type="number" defaultValue={10} /></div>
              <div><Label>Monthly discount (%)</Label><Input type="number" defaultValue={20} /></div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-semibold">Notification preferences</h2>
            {[
              { label: "Email notifications for new bookings", desc: "Get notified when a customer requests a booking", on: true },
              { label: "SMS alerts for urgent matters", desc: "Receive SMS for cancellations and disputes", on: true },
              { label: "Daily summary report", desc: "Email digest of yesterday's activity", on: false },
            ].map((p, i) => <Row key={i} {...p} />)}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Row({ label, desc, on }: { label: string; desc: string; on: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border pb-4 last:border-0">
      <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
      <Switch defaultChecked={on} />
    </div>
  );
}
