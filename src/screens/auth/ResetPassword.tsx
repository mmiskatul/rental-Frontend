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
  const email = searchParams.get("email") ?? "";
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCodeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      toast.error("Reset email is missing. Please start again.");
      router.push("/forgot-password");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest("/api/auth/verify-reset-code", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      setIsCodeVerified(true);
      toast.success("Code verified");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not verify reset code.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
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
      title={isCodeVerified ? "Set a new password" : "Verify reset code"}
      subtitle={isCodeVerified ? "Choose a strong password to secure your account." : "Enter the 6-digit code sent to your email."}
      footer={<Link href="/login" className="font-medium text-foreground hover:text-accent">Back to sign in</Link>}
    >
      {isCodeVerified ? (
        <form className="space-y-4" onSubmit={handlePasswordSubmit}>
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
      ) : (
        <form className="space-y-4" onSubmit={handleCodeSubmit}>
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
          <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary-glow" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify code"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
