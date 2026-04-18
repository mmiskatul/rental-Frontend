import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { toast } from "sonner";

export default function ResetPassword() {
  const router = useRouter();
  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password to secure your account."
      footer={<Link href="/login" className="font-medium text-foreground hover:text-accent">Back to sign in</Link>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Password reset"); router.push("/login"); }}>
        <div>
          <Label>New password</Label>
          <Input type="password" placeholder="At least 8 characters" />
        </div>
        <div>
          <Label>Confirm password</Label>
          <Input type="password" />
        </div>
        <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary-glow">Reset password</Button>
      </form>
    </AuthLayout>
  );
}
