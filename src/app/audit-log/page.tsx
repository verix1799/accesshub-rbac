"use client";

import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import { AuditLog } from "@/lib/mock-data";
import { useAppState } from "@/context/AppStateContext";

const statusVariant = (status: AuditLog["status"]) =>
  status === "success" ? "success" : "error";

const columns = [
  { key: "timestamp", label: "Timestamp" },
  {
    key: "user",
    label: "User",
    render: (val: string) => <span className="font-medium text-white">{val}</span>,
  },
  { key: "action", label: "Action" },
  { key: "resource", label: "Resource" },
  {
    key: "details",
    label: "Details",
    render: (val: string | undefined) => (
      <span className="text-xs text-gray-500">{val ?? "—"}</span>
    ),
  },
  {
    key: "ip",
    label: "IP Address",
    render: (val: string) => (
      <span className="font-mono text-xs text-gray-400">{val}</span>
    ),
  },
  {
    key: "status",
    label: "Result",
    render: (val: AuditLog["status"]) => <Badge label={val} variant={statusVariant(val)} />,
  },
];

export default function AuditLogPage() {
  const { auditLogs } = useAppState();
  const failed = auditLogs.filter((l) => l.status === "failed").length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Log</h1>
          <p className="text-gray-400 mt-1">
            {auditLogs.length} events recorded · {failed} failures
          </p>
        </div>
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors border border-gray-700">
          Export CSV
        </button>
      </div>

      {failed > 0 && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6">
          <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <p className="text-sm text-red-300">
            <span className="font-semibold">{failed} failed events</span> detected in the log. Review these entries for potential security issues.
          </p>
        </div>
      )}

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <DataTable columns={columns} data={auditLogs} />
      </div>
    </div>
  );
}
