/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import React from "react";

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
      <head>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
