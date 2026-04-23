import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/index.css";
import { AppProviders } from "./providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "DriveFlow | Premium Car Rentals",
  description: "Premium car rental platform with customer and admin dashboards.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={jakarta.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
