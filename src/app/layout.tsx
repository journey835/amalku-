import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AmalKu - Tracker Ibadah Ramadhan",
  description: "Aplikasi tracker ibadah Ramadhan untuk keluarga dengan sistem poin, badge, dan leaderboard",
  keywords: ["ramadhan", "ibadah", "tracker", "keluarga", "puasa", "sholat"],
  authors: [{ name: "AmalKu Team" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌙</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
