import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, setAccessToken, setRefreshToken } from "@/lib/api";
import { addFavoriteCar } from "@/lib/favorites-api";
import { toast } from "sonner";

type AuthResponse = {
  user: {
    role: "customer" | "admin" | "landlord";
  };
  tokens: {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
};

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function signIn(credentials = { email, password }) {
    setIsSubmitting(true);

    try {
      const data = await apiRequest<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      setAccessToken(data.tokens.access_token);
      setRefreshToken(data.tokens.refresh_token);
      const currentUser = await refreshUser();
      if (!currentUser) {
        throw new Error("Signed in, but your session could not be loaded. Check the deployed API URL and CORS settings.");
      }
      const favoriteCarId = searchParams.get("favoriteCar");
      if (favoriteCarId && data.user.role !== "admin") {
        await addFavoriteCar(favoriteCarId).catch(() => null);
      }
      toast.success("Signed in");
      router.replace(getRedirectPath(data.user.role, searchParams.get("next")));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await signIn();
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your DriveFlow account."
      footer={<>Don&apos;t have an account? <Link href="/register" className="font-medium text-foreground hover:text-accent">Create one</Link></>}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label>Password</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-muted-foreground hover:text-foreground">Forgot?</Link>
          </div>
          <Input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" defaultChecked />
          <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">Remember me for 30 days</Label>
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary-glow" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
}

function getRedirectPath(role: AuthResponse["user"]["role"], nextPath: string | null) {
  if (role === "admin") {
    return nextPath?.startsWith("/admin") ? nextPath : "/admin";
  }

  if (!nextPath || nextPath.startsWith("/admin") || nextPath.startsWith("/login")) {
    return "/dashboard";
  }

  return nextPath;
}
