"use client";

import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["customer", "landlord", "admin"]}>
      <CustomerLayout>{children}</CustomerLayout>
    </ProtectedRoute>
  );
}
