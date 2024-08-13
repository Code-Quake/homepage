// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SWRConfig } from "swr";

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 5000,
        focusThrottleInterval: 10000,
        refreshInterval: 3000,
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <NextUIProvider>{children}</NextUIProvider>
    </SWRConfig>
  );
}
