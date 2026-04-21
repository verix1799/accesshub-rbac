"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  accessRequests as initialRequests,
  auditLogs as initialAuditLogs,
  AccessRequest,
  AuditLog,
} from "@/lib/mock-data";

interface AppState {
  requests: AccessRequest[];
  setRequests: React.Dispatch<React.SetStateAction<AccessRequest[]>>;
  auditLogs: AuditLog[];
  addAuditEntry: (entry: AuditLog) => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<AccessRequest[]>(initialRequests);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  function addAuditEntry(entry: AuditLog) {
    setAuditLogs((prev) => [entry, ...prev]);
  }

  return (
    <AppStateContext.Provider value={{ requests, setRequests, auditLogs, addAuditEntry }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
