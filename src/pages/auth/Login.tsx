import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { toast } from "sonner";

export default function Login() {
  const nav = useNavigate();
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your DriveFlow account."
      footer={<>Don't have an account? <Link to="/register" className="font-medium text-foreground hover:text-accent">Create one</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Signed in"); nav("/dashboard"); }}>
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" defaultValue="olivia.m@example.com" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label>Password</Label>
            <Link to="/forgot-password" className="text-xs font-medium text-muted-foreground hover:text-foreground">Forgot?</Link>
          </div>
          <Input type="password" placeholder="••••••••" defaultValue="password" />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" defaultChecked />
          <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">Remember me for 30 days</Label>
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary-glow" size="lg">Sign in</Button>
        <Button type="button" variant="outline" className="w-full" size="lg" onClick={() => { toast.success("Admin signed in"); nav("/admin"); }}>
          Continue as Admin (demo)
        </Button>
      </form>
    </AuthLayout>
  );
}
