"use client";

import { Suspense } from "react";
import Login from "@/screens/auth/Login";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <Login />
    </Suspense>
  );
}
