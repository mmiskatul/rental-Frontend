import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, password, role: "customer" }),
      });
      toast.success("Verification code sent");
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start booking premium cars in minutes."
      footer={<>Already have an account? <Link href="/login" className="font-medium text-foreground hover:text-accent">Sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label>Full name</Label>
          <Input placeholder="Olivia Martinez" value={name} onChange={(event) => setName(event.target.value)} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <div>
          <Label>Phone</Label>
          <Input type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>
        <div>
          <Label>Confirm password</Label>
          <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
        </div>
        <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary-glow" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create account"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">By signing up you agree to our Terms and Privacy Policy.</p>
      </form>
    </AuthLayout>
  );
}
