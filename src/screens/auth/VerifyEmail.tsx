import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

type AuthResponse = {
  user: {
    role: "customer" | "admin" | "landlord";
  };
};

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const email = searchParams.get("email") ?? "";
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      toast.error("Verification email is missing. Please register again.");
      router.push("/register");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await apiRequest<AuthResponse>("/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      await refreshUser();
      toast.success("Account verified");
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (!email) {
      toast.error("Verification email is missing. Please register again.");
      router.push("/register");
      return;
    }

    setIsResending(true);

    try {
      await apiRequest("/api/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      toast.success("Verification code sent");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not resend code.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-digit code sent to your inbox."
      footer={<Link href="/login" className="font-medium text-foreground hover:text-accent">Back to sign in</Link>}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label>Email</Label>
          <div className="mt-2 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground">
            {email || "No email found"}
          </div>
        </div>
        <div>
          <Label>Verification code</Label>
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
          {isSubmitting ? "Verifying..." : "Verify account"}
        </Button>
        <Button type="button" variant="outline" size="lg" className="w-full" onClick={handleResend} disabled={!email || isResending}>
          {isResending ? "Sending..." : "Resend code"}
        </Button>
      </form>
    </AuthLayout>
  );
}
