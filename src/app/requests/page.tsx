"use client";

import { useState } from "react";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import { AccessRequest, AuditLog, users, roles } from "@/lib/mock-data";
import { useAppState } from "@/context/AppStateContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const REVIEWER = "Rachel Okonkwo";
const REVIEWER_IP = "10.10.1.42";

function nowTimestamp() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function nextTicketId(requests: AccessRequest[]) {
  const nums = requests.map((r) => parseInt(r.ticketId.replace("INC-", ""), 10));
  return `INC-${Math.max(...nums) + 1}`;
}

const statusVariant = (status: AccessRequest["status"]) => {
  if (status === "approved") return "success";
  if (status === "rejected") return "error";
  return "warning";
};

const typeLabel: Record<AccessRequest["type"], string> = {
  access: "Access Grant",
  role_change: "Role Change",
  permission: "Permission",
  offboarding: "Offboarding",
};

const typeVariant = (type: AccessRequest["type"]) => {
  if (type === "offboarding") return "error";
  if (type === "role_change") return "warning";
  if (type === "permission") return "info";
  return "neutral";
};

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  requesterId: string;
  department: string;
  roleId: string;
  justification: string;
}

const emptyForm: FormState = {
  requesterId: "",
  department: "",
  roleId: "",
  justification: "",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

type FilterStatus = "all" | AccessRequest["status"];

interface RejectTarget {
  id: string;
  ticketId: string;
  requester: string;
  resource: string;
}

export default function RequestsPage() {
  const { requests, setRequests, addAuditEntry } = useAppState();

  const [filter, setFilter] = useState<FilterStatus>("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [actionBanner, setActionBanner] = useState<{ type: "approved" | "rejected"; ticketId: string } | null>(null);

  const [rejectTarget, setRejectTarget] = useState<RejectTarget | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonError, setRejectReasonError] = useState("");

  // ── Approve ───────────────────────────────────────────────────────────────

  function handleApprove(id: string) {
    const req = requests.find((r) => r.id === id);
    if (!req || req.status !== "pending") return;

    const now = nowTimestamp();

    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "approved", reviewedBy: REVIEWER, reviewedAt: now.slice(0, 10) }
          : r
      )
    );

    const entry: AuditLog = {
      id: `audit-${Date.now()}`,
      user: REVIEWER,
      action: "Request Approved",
      resource: `${req.ticketId} — ${req.requester} → ${req.resource}`,
      timestamp: now,
      ip: REVIEWER_IP,
      status: "success",
      details: `Approved via ${req.ticketId}`,
    };
    addAuditEntry(entry);
    setActionBanner({ type: "approved", ticketId: req.ticketId });
    setSubmitted(null);
  }

  // ── Reject ────────────────────────────────────────────────────────────────

  function openRejectModal(id: string) {
    const req = requests.find((r) => r.id === id);
    if (!req || req.status !== "pending") return;
    setRejectTarget({ id: req.id, ticketId: req.ticketId, requester: req.requester, resource: req.resource });
    setRejectReason("");
    setRejectReasonError("");
  }

  function handleRejectConfirm() {
    if (!rejectTarget) return;
    if (!rejectReason.trim()) {
      setRejectReasonError("A rejection reason is required.");
      return;
    }
    if (rejectReason.trim().length < 10) {
      setRejectReasonError("Please provide at least 10 characters.");
      return;
    }

    const now = nowTimestamp();

    setRequests((prev) =>
      prev.map((r) =>
        r.id === rejectTarget.id
          ? {
              ...r,
              status: "rejected",
              reviewedBy: REVIEWER,
              reviewedAt: now.slice(0, 10),
              rejectionReason: rejectReason.trim(),
            }
          : r
      )
    );

    const entry: AuditLog = {
      id: `audit-${Date.now()}`,
      user: REVIEWER,
      action: "Request Rejected",
      resource: `${rejectTarget.ticketId} — ${rejectTarget.requester}`,
      timestamp: now,
      ip: REVIEWER_IP,
      status: "success",
      details: `Rejected: ${rejectReason.trim()}`,
    };
    addAuditEntry(entry);
    setActionBanner({ type: "rejected", ticketId: rejectTarget.ticketId });
    setSubmitted(null);
    setRejectTarget(null);
    setRejectReason("");
  }

  // ── Columns (defined inside component to close over handlers) ─────────────

  const columns = [
    {
      key: "ticketId",
      label: "Ticket",
      render: (val: string) => (
        <span className="font-mono text-xs text-indigo-400">{val}</span>
      ),
    },
    {
      key: "requester",
      label: "Requester",
      render: (val: string, row: Record<string, unknown>) => (
        <div>
          <p className="font-medium text-white">{val}</p>
          <p className="text-xs text-gray-500">{String(row.requesterDepartment)}</p>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (val: AccessRequest["type"]) => (
        <Badge label={typeLabel[val]} variant={typeVariant(val)} />
      ),
    },
    {
      key: "resource",
      label: "Resource / Role",
      render: (val: string, row: Record<string, unknown>) => (
        <div className="max-w-xs">
          <p className="text-gray-200">{val}</p>
          <p className="text-xs text-gray-600 truncate" title={String(row.justification)}>
            {String(row.justification)}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val: AccessRequest["status"], row: Record<string, unknown>) => (
        <div>
          <Badge label={val} variant={statusVariant(val)} />
          {val === "rejected" && !!row.rejectionReason && (
            <p
              className="text-xs text-red-400 mt-1.5 max-w-[160px] leading-snug"
              title={String(row.rejectionReason)}
            >
              {String(row.rejectionReason)}
            </p>
          )}
        </div>
      ),
    },
    { key: "createdAt", label: "Submitted" },
    {
      key: "reviewedBy",
      label: "Reviewed By",
      render: (val: string | undefined, row: Record<string, unknown>) => (
        <div>
          <span className="text-gray-400">{val ?? "—"}</span>
          {!!row.reviewedAt && (
            <p className="text-xs text-gray-600 mt-0.5">{String(row.reviewedAt)}</p>
          )}
        </div>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (val: string, row: Record<string, unknown>) =>
        row.status === "pending" ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleApprove(val)}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              Approve
            </button>
            <span className="text-gray-700">·</span>
            <button
              onClick={() => openRejectModal(val)}
              className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-600">Closed</span>
        ),
    },
  ];

  // ── New request form ──────────────────────────────────────────────────────

  function handleRequesterChange(id: string) {
    const user = users.find((u) => u.id === id);
    setForm((f) => ({ ...f, requesterId: id, department: user?.department ?? "" }));
    setFormErrors((e) => ({ ...e, requesterId: undefined, department: undefined }));
  }

  function validateForm(): boolean {
    const next: Partial<FormState> = {};
    if (!form.requesterId) next.requesterId = "Select a requester.";
    if (!form.roleId) next.roleId = "Select a requested role.";
    if (!form.justification.trim()) next.justification = "Justification is required.";
    else if (form.justification.trim().length < 20)
      next.justification = "Please provide at least 20 characters.";
    setFormErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    const user = users.find((u) => u.id === form.requesterId)!;
    const role = roles.find((r) => r.id === form.roleId)!;
    const ticketId = nextTicketId(requests);

    const newRequest: AccessRequest = {
      id: `req-${Date.now()}`,
      ticketId,
      requester: user.name,
      requesterEmail: user.email,
      requesterDepartment: user.department,
      type: "role_change",
      resource: role.name,
      justification: form.justification.trim(),
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setRequests((prev) => [newRequest, ...prev]);
    setFilter("all");
    setShowForm(false);
    setForm(emptyForm);
    setFormErrors({});
    setActionBanner(null);
    setSubmitted(ticketId);
  }

  function handleCloseForm() {
    setShowForm(false);
    setForm(emptyForm);
    setFormErrors({});
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const tabs: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Access Requests</h1>
          <p className="text-gray-400 mt-1">
            {requests.filter((r) => r.status === "pending").length} requests pending review
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setSubmitted(null); setActionBanner(null); }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + New Request
        </button>
      </div>

      {/* Submission banner */}
      {submitted && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 mb-6">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <p className="text-sm text-emerald-300">
            Request <span className="font-mono font-semibold">{submitted}</span> submitted and is pending review.
          </p>
          <button onClick={() => setSubmitted(null)} className="ml-auto text-emerald-500 hover:text-emerald-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Action result banner */}
      {actionBanner && (
        <div className={`flex items-center gap-3 rounded-lg px-4 py-3 mb-6 border ${
          actionBanner.type === "approved"
            ? "bg-emerald-500/10 border-emerald-500/20"
            : "bg-red-500/10 border-red-500/20"
        }`}>
          <svg className={`w-4 h-4 shrink-0 ${actionBanner.type === "approved" ? "text-emerald-400" : "text-red-400"}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <p className={`text-sm ${actionBanner.type === "approved" ? "text-emerald-300" : "text-red-300"}`}>
            <span className="font-mono font-semibold">{actionBanner.ticketId}</span>{" "}
            {actionBanner.type === "approved" ? "has been approved." : "has been rejected."}{" "}
            <a href="/audit-log" className="underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity">
              View in Audit Log →
            </a>
          </p>
          <button onClick={() => setActionBanner(null)} className={`ml-auto transition-colors ${actionBanner.type === "approved" ? "text-emerald-500 hover:text-emerald-300" : "text-red-500 hover:text-red-300"}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-800">
        {tabs.map((tab) => {
          const count = tab.value === "all"
            ? requests.length
            : requests.filter((r) => r.status === tab.value).length;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                filter === tab.value
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                filter === tab.value ? "bg-indigo-500/20 text-indigo-300" : "bg-gray-800 text-gray-500"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <DataTable columns={columns} data={filtered} emptyMessage="No requests match this filter." />
      </div>

      {/* ── Reject confirmation modal ───────────────────────────────────────── */}
      {rejectTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setRejectTarget(null); }}
        >
          <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl">
            <div className="flex items-start justify-between px-6 py-5 border-b border-gray-800">
              <div>
                <h2 className="text-base font-semibold text-white">Reject Request</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  <span className="font-mono text-indigo-400">{rejectTarget.ticketId}</span>
                  {" · "}{rejectTarget.requester} → {rejectTarget.resource}
                </p>
              </div>
              <button
                onClick={() => setRejectTarget(null)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Rejection Reason <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={3}
                autoFocus
                value={rejectReason}
                onChange={(e) => { setRejectReason(e.target.value); setRejectReasonError(""); }}
                placeholder="State why this request is being rejected and any steps the requester should take…"
                className={`w-full bg-gray-800 border rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none transition-colors ${
                  rejectReasonError ? "border-red-500" : "border-gray-700 hover:border-gray-600"
                }`}
              />
              {rejectReasonError && (
                <p className="text-xs text-red-400 mt-1">{rejectReasonError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800 bg-gray-800/30 rounded-b-2xl">
              <button
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── New request modal ───────────────────────────────────────────────── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseForm(); }}
        >
          <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
              <div>
                <h2 className="text-base font-semibold text-white">New Access Request</h2>
                <p className="text-xs text-gray-500 mt-0.5">Submit a role or access request for IAM review</p>
              </div>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-300 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="px-6 py-5 space-y-5">
                {/* Requester */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Requester <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.requesterId}
                    onChange={(e) => handleRequesterChange(e.target.value)}
                    className={`w-full bg-gray-800 border rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                      formErrors.requesterId ? "border-red-500" : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <option value="" disabled>Select employee…</option>
                    {users.filter((u) => u.status === "active").map((u) => (
                      <option key={u.id} value={u.id}>{u.name} — {u.title}</option>
                    ))}
                  </select>
                  {formErrors.requesterId && (
                    <p className="text-xs text-red-400 mt-1">{formErrors.requesterId}</p>
                  )}
                </div>

                {/* Department (auto-filled) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Department / Team
                  </label>
                  <input
                    readOnly
                    value={form.department}
                    placeholder="Auto-populated from selected employee"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-400 cursor-not-allowed select-none"
                  />
                </div>

                {/* Requested role */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Requested Role <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.roleId}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, roleId: e.target.value }));
                      setFormErrors((err) => ({ ...err, roleId: undefined }));
                    }}
                    className={`w-full bg-gray-800 border rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                      formErrors.roleId ? "border-red-500" : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <option value="" disabled>Select role…</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                  {form.roleId && (() => {
                    const selected = roles.find((r) => r.id === form.roleId);
                    if (!selected) return null;
                    const riskColor =
                      selected.riskLevel === "critical" ? "text-red-400" :
                      selected.riskLevel === "high" ? "text-amber-400" :
                      selected.riskLevel === "medium" ? "text-blue-400" : "text-gray-500";
                    return (
                      <p className={`text-xs mt-1.5 ${riskColor}`}>
                        Risk level: <span className="font-medium capitalize">{selected.riskLevel}</span>
                        <span className="text-gray-600"> · {selected.description}</span>
                      </p>
                    );
                  })()}
                  {formErrors.roleId && (
                    <p className="text-xs text-red-400 mt-1">{formErrors.roleId}</p>
                  )}
                </div>

                {/* Business justification */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Business Justification <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={form.justification}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, justification: e.target.value }));
                      setFormErrors((err) => ({ ...err, justification: undefined }));
                    }}
                    placeholder="Describe why this access is required, how it will be used, and the business impact if not granted…"
                    className={`w-full bg-gray-800 border rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-colors ${
                      formErrors.justification ? "border-red-500" : "border-gray-700 hover:border-gray-600"
                    }`}
                  />
                  <div className="flex items-start justify-between mt-1">
                    {formErrors.justification
                      ? <p className="text-xs text-red-400">{formErrors.justification}</p>
                      : <span />}
                    <p className="text-xs text-gray-600 ml-auto">{form.justification.length} chars</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-gray-800/30 rounded-b-2xl">
                <p className="text-xs text-gray-600">
                  New requests are set to <span className="text-amber-400 font-medium">Pending</span> by default
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
