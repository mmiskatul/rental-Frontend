import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/mock-data";
import { getCustomerSettings, updateCustomerSettings, type CustomerSettings } from "@/lib/customer-settings-api";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function Profile() {
  const [settings, setSettings] = useState<CustomerSettings | null>(null);
  const [savedSettings, setSavedSettings] = useState<CustomerSettings | null>(null);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [isSaving, setIsSaving] = useState(false);
  const isDirty = useMemo(() => JSON.stringify(settings) !== JSON.stringify(savedSettings), [settings, savedSettings]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const loaded = await getCustomerSettings();
        setSettings(loaded);
        setSavedSettings(loaded);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load profile settings.");
      }
    }

    loadSettings();
  }, []);

  async function handleUpdate() {
    if (!settings) return;
    setIsSaving(true);
    try {
      const updated = await updateCustomerSettings(settings);
      setSettings(updated);
      setSavedSettings(updated);
      toast.success("Profile settings updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update settings.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePasswordUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      await apiRequest("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: passwords.currentPassword,
          new_password: passwords.newPassword,
        }),
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update password.");
    }
  }

  if (!settings) {
    return <div className="h-[420px] rounded-lg bg-secondary/70" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Profile settings</h1>
          <p className="mt-1 text-muted-foreground">Manage your personal info, security and preferences.</p>
        </div>
        {isDirty && (
          <Button onClick={handleUpdate} disabled={isSaving} className="bg-primary hover:bg-primary-glow">
            {isSaving ? "Updating..." : "Update settings"}
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card className="p-6 text-center">
          <Avatar className="mx-auto h-20 w-20"><AvatarFallback className="bg-primary text-primary-foreground text-xl">{getInitials(settings.profile.name)}</AvatarFallback></Avatar>
          <p className="mt-4 font-semibold">{settings.profile.name}</p>
          <p className="text-xs text-muted-foreground">{settings.profile.email}</p>
          <Separator className="my-4" />
          <div className="grid grid-cols-3 gap-2 text-center">
            <div><p className="text-lg font-bold">{settings.stats.totalBookings}</p><p className="text-[10px] text-muted-foreground">Bookings</p></div>
            <div><p className="text-lg font-bold">{formatCurrency(settings.stats.totalSpend)}</p><p className="text-[10px] text-muted-foreground">Spent</p></div>
            <div><p className="text-lg font-bold">{settings.stats.averageRating || "0.0"}</p><p className="text-[10px] text-muted-foreground">Rating</p></div>
          </div>
          <Button variant="outline" size="sm" className="mt-5 w-full">Change photo</Button>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Personal information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={settings.profile.name} onChange={(value) => setSettings({ ...settings, profile: { ...settings.profile, name: value } })} />
              <Field label="Email" type="email" value={settings.profile.email} onChange={(value) => setSettings({ ...settings, profile: { ...settings.profile, email: value } })} />
              <Field label="Phone" value={settings.profile.phone} onChange={(value) => setSettings({ ...settings, profile: { ...settings.profile, phone: value } })} />
              <Field label="Address" value={settings.profile.address} onChange={(value) => setSettings({ ...settings, profile: { ...settings.profile, address: value } })} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Security</h2>
            <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handlePasswordUpdate}>
              <div className="sm:col-span-2"><Label>Current password</Label><Input type="password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} /></div>
              <div><Label>New password</Label><Input type="password" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} /></div>
              <div><Label>Confirm new password</Label><Input type="password" value={passwords.confirmPassword} onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })} /></div>
              <div className="sm:col-span-2 flex justify-end"><Button type="submit" variant="outline">Update password</Button></div>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Preferences</h2>
            <div className="mt-4 space-y-4">
              <SwitchRow label="Booking confirmations" desc="Email and in-app notifications when status changes" checked={settings.preferences.bookingConfirmations} onCheckedChange={(value) => setSettings({ ...settings, preferences: { ...settings.preferences, bookingConfirmations: value } })} />
              <SwitchRow label="Promotional emails" desc="New cars, discounts, and seasonal offers" checked={settings.preferences.promotionalEmails} onCheckedChange={(value) => setSettings({ ...settings, preferences: { ...settings.preferences, promotionalEmails: value } })} />
              <SwitchRow label="SMS reminders" desc="Pickup and return reminders via SMS" checked={settings.preferences.smsReminders} onCheckedChange={(value) => setSettings({ ...settings, preferences: { ...settings.preferences, smsReminders: value } })} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function SwitchRow({ label, desc, checked, onCheckedChange }: { label: string; desc: string; checked: boolean; onCheckedChange: (value: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
