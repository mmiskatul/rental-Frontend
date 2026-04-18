import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { toast } from "sonner";

export default function Register() {
  const router = useRouter();
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start booking premium cars in minutes."
      footer={<>Already have an account? <Link href="/login" className="font-medium text-foreground hover:text-accent">Sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Account created"); router.push("/dashboard"); }}>
        <div>
          <Label>Full name</Label>
          <Input placeholder="Olivia Martinez" />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" />
        </div>
        <div>
          <Label>Phone</Label>
          <Input type="tel" placeholder="+1 (555) 000-0000" />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" placeholder="At least 8 characters" />
        </div>
        <div>
          <Label>Confirm password</Label>
          <Input type="password" />
        </div>
        <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary-glow">Create account</Button>
        <p className="text-center text-xs text-muted-foreground">By signing up you agree to our Terms and Privacy Policy.</p>
      </form>
    </AuthLayout>
  );
}
