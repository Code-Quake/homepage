// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { motion } from "framer-motion";
import { AuroraBackground } from "../modules/ui/AuroraBackground";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
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
    </NextUIProvider>
  );
}
