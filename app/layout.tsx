/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

// This default export is required in a new `pages/_app.js` file.
export const metadata: Metadata = {
  title: "CodeQuake",
  description: "My very own home page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body style={{ height: "100vh" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
