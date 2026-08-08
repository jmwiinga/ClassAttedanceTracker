import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/lib/data-context";

export const metadata: Metadata = {
  title: "Register — Attendance Tracker",
  description: "Track class attendance and flag students below the 80% target.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
