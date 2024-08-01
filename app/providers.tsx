// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { motion } from "framer-motion";
import { AuroraBackground } from "../modules/ui/AuroraBackground";
import { BackgroundBeams } from "@/modules/ui/BackgroundBeams";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  );
}
