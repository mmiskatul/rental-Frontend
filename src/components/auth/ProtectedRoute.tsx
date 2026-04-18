"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth, type AuthUser } from "@/contexts/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: AuthUser["role"][];
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const isAllowed = Boolean(user && (!allowedRoles || allowedRoles.includes(user.role)));

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      window.location.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!isAllowed) {
      window.location.replace("/login");
    }
  }, [isAllowed, isLoading, pathname, user]);

  if (isLoading || !isAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
