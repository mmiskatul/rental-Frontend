"use client";

import { Suspense } from "react";
import ResetPassword from "@/screens/auth/ResetPassword";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  );
}
