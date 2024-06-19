"use client"; 
/* eslint-disable @next/next/no-sync-scripts */
import "./globals.css";
import { Providers } from "./providers";
import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "../modules/ui/AuroraBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <AuroraBackground>
            <motion.div
              initial={{ opacity: 0.0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="relative flex flex-col gap-4 px-4"
            >
              {children}
            </motion.div>
          </AuroraBackground>
        </Providers>
      </body>
    </html>
  );
}
