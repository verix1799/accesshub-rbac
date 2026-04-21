"use client";

import { AppStateProvider } from "@/context/AppStateContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AppStateProvider>{children}</AppStateProvider>;
}
