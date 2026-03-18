import type { Metadata } from "next";

import "@/app/globals.css";
import { AppStoreProvider } from "@/lib/store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hyrox Couple",
  description: "Premium Hyrox training, habit, and rewards dashboard for Lawton and Katy."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased"
        )}
      >
        <AppStoreProvider>{children}</AppStoreProvider>
      </body>
    </html>
  );
}
