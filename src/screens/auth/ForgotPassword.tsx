import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { toast } from "sonner";

export default function ForgotPassword() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={<><Link href="/login" className="font-medium text-foreground hover:text-accent">← Back to sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Reset link sent — check your inbox."); }}>
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" />
        </div>
        <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary-glow">Send reset link</Button>
      </form>
    </AuthLayout>
  );
}
