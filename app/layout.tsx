"use client"; 
/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "../modules/AuroraBackground/AuroraBackground";

// This default export is required in a new `pages/_app.js` file.
// export const metadata: Metadata = {
//   title: "CodeQuake",
//   description: "My very own home page",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <AuroraBackground style={{ height: "100vh" }}>
            <motion.div
              initial={{ opacity: 0.0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="relative flex flex-col gap-4 items-center px-4"
            >
              {children}
            </motion.div>
          </AuroraBackground>
        </Providers>
      </body>
    </html>
  );
}
