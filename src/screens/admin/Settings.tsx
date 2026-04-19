import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminSettings, updateAdminSettings, type AdminSettings as AdminSettingsData } from "@/lib/settings-api";
import { toast } from "sonner";

export default function AdminSettings() {
  const [settings, setSettings] = useState<AdminSettingsData | null>(null);
  const [savedSettings, setSavedSettings] = useState<AdminSettingsData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isDirty = useMemo(() => JSON.stringify(settings) !== JSON.stringify(savedSettings), [settings, savedSettings]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const loaded = await getAdminSettings();
        setSettings(loaded);
        setSavedSettings(loaded);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load settings.");
      }
    }

    loadSettings();
  }, []);

  async function handleUpdate() {
    if (!settings) return;
    setIsSaving(true);
    try {
      const updated = await updateAdminSettings(settings);
      setSettings(updated);
      setSavedSettings(updated);
      toast.success("Settings updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update settings.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!settings) {
    return <div className="h-[420px] rounded-lg bg-secondary/70" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Settings</h1>
          <p className="mt-1 text-muted-foreground">Configure your business, policies and platform preferences.</p>
        </div>
        {isDirty && (
          <Button onClick={handleUpdate} disabled={isSaving} className="bg-primary hover:bg-primary-glow">
            {isSaving ? "Updating..." : "Update settings"}
          </Button>
        )}
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
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Company name" value={settings.business.companyName} onChange={(value) => setSettings({ ...settings, business: { ...settings.business, companyName: value } })} />
              <Field label="Support email" value={settings.business.supportEmail} onChange={(value) => setSettings({ ...settings, business: { ...settings.business, supportEmail: value } })} />
              <Field label="Support phone" value={settings.business.supportPhone} onChange={(value) => setSettings({ ...settings, business: { ...settings.business, supportPhone: value } })} />
              <Field label="Business hours" value={settings.business.businessHours} onChange={(value) => setSettings({ ...settings, business: { ...settings.business, businessHours: value } })} />
              <Field label="HQ address" value={settings.business.hqAddress} className="sm:col-span-2" onChange={(value) => setSettings({ ...settings, business: { ...settings.business, hqAddress: value } })} />
              <div className="sm:col-span-2">
                <Label>About</Label>
                <Textarea rows={3} value={settings.business.about} onChange={(event) => setSettings({ ...settings, business: { ...settings.business, about: event.target.value } })} />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="booking" className="mt-6">
          <Card className="space-y-5 p-6">
            <h2 className="text-lg font-semibold">Booking policy</h2>
            <SwitchRow label="Auto-approve verified customers" desc="Skip manual review for repeat customers with 3+ completed bookings" checked={settings.bookingPolicy.autoApproveVerifiedCustomers} onCheckedChange={(value) => setSettings({ ...settings, bookingPolicy: { ...settings.bookingPolicy, autoApproveVerifiedCustomers: value } })} />
            <SwitchRow label="Require deposit" desc="Hold a security deposit on the customer's card" checked={settings.bookingPolicy.requireDeposit} onCheckedChange={(value) => setSettings({ ...settings, bookingPolicy: { ...settings.bookingPolicy, requireDeposit: value } })} />
            <SwitchRow label="Allow same-day bookings" desc="Customers can book a car for pickup the same day" checked={settings.bookingPolicy.allowSameDayBookings} onCheckedChange={(value) => setSettings({ ...settings, bookingPolicy: { ...settings.bookingPolicy, allowSameDayBookings: value } })} />
            <SwitchRow label="Minimum rental period" desc="Enforce a minimum number of rental days" checked={settings.bookingPolicy.enforceMinimumRentalPeriod} onCheckedChange={(value) => setSettings({ ...settings, bookingPolicy: { ...settings.bookingPolicy, enforceMinimumRentalPeriod: value } })} />
          </Card>
        </TabsContent>

        <TabsContent value="cancellation" className="mt-6">
          <Card className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">Cancellation rules</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Free cancellation window (hours)" value={settings.cancellation.freeCancellationHours} onChange={(value) => setSettings({ ...settings, cancellation: { ...settings.cancellation, freeCancellationHours: value } })} />
              <NumberField label="Late cancellation fee (%)" value={settings.cancellation.lateCancellationFeePercent} onChange={(value) => setSettings({ ...settings, cancellation: { ...settings.cancellation, lateCancellationFeePercent: value } })} />
              <Field label="No-show fee" value={settings.cancellation.noShowFee} onChange={(value) => setSettings({ ...settings, cancellation: { ...settings.cancellation, noShowFee: value } })} />
              <Field label="Refund processing time" value={settings.cancellation.refundProcessingTime} onChange={(value) => setSettings({ ...settings, cancellation: { ...settings.cancellation, refundProcessingTime: value } })} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <Card className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">Pricing rules</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Service fee (%)" value={settings.pricing.serviceFeePercent} onChange={(value) => setSettings({ ...settings, pricing: { ...settings.pricing, serviceFeePercent: value } })} />
              <NumberField label="Tax rate (%)" value={settings.pricing.taxRatePercent} onChange={(value) => setSettings({ ...settings, pricing: { ...settings.pricing, taxRatePercent: value } })} />
              <NumberField label="Weekly discount (%)" value={settings.pricing.weeklyDiscountPercent} onChange={(value) => setSettings({ ...settings, pricing: { ...settings.pricing, weeklyDiscountPercent: value } })} />
              <NumberField label="Monthly discount (%)" value={settings.pricing.monthlyDiscountPercent} onChange={(value) => setSettings({ ...settings, pricing: { ...settings.pricing, monthlyDiscountPercent: value } })} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="space-y-5 p-6">
            <h2 className="text-lg font-semibold">Notification preferences</h2>
            <SwitchRow label="Email notifications for new bookings" desc="Get notified when a customer requests a booking" checked={settings.notifications.emailNewBookings} onCheckedChange={(value) => setSettings({ ...settings, notifications: { ...settings.notifications, emailNewBookings: value } })} />
            <SwitchRow label="SMS alerts for urgent matters" desc="Receive SMS for cancellations and disputes" checked={settings.notifications.smsUrgentAlerts} onCheckedChange={(value) => setSettings({ ...settings, notifications: { ...settings.notifications, smsUrgentAlerts: value } })} />
            <SwitchRow label="Daily summary report" desc="Email digest of yesterday's activity" checked={settings.notifications.dailySummaryReport} onCheckedChange={(value) => setSettings({ ...settings, notifications: { ...settings.notifications, dailySummaryReport: value } })} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value, onChange, className }: { label: string; value: string; onChange: (value: string) => void; className?: string }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </div>
  );
}

function SwitchRow({ label, desc, checked, onCheckedChange }: { label: string; desc: string; checked: boolean; onCheckedChange: (value: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border pb-4 last:border-0">
      <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
