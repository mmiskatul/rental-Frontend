import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, code, new_password: password }),
      });
      toast.success("Password reset");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not reset password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password to secure your account."
      footer={<Link href="/login" className="font-medium text-foreground hover:text-accent">Back to sign in</Link>}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <div>
          <Label>Reset code</Label>
          <Input
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            required
          />
        </div>
        <div>
          <Label>New password</Label>
          <Input type="password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>
        <div>
          <Label>Confirm password</Label>
          <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
        </div>
        <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary-glow" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
