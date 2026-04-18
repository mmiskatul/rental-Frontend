"use client";

import { Suspense } from "react";
import VerifyEmail from "@/screens/auth/VerifyEmail";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmail />
    </Suspense>
  );
}
