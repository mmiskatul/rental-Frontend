"use client";

import Link from "next/link";
import { ArrowLeft, Car } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <Car className="h-7 w-7" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-accent">404</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Button asChild className="mt-6 bg-primary hover:bg-primary-glow">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
