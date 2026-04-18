import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      toast.success("Reset code sent");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send reset code.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we will send you a reset code."
      footer={<><Link href="/login" className="font-medium text-foreground hover:text-accent">Back to sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary-glow" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send reset code"}
        </Button>
      </form>
    </AuthLayout>
  );
}
