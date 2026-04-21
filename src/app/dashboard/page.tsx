import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import { users, roles, accessRequests, auditLogs } from "@/lib/mock-data";

function UsersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

const auditStatusVariant = (status: string) =>
  status === "success" ? "success" : "error";

const recentAuditColumns = [
  { key: "user", label: "User" },
  { key: "action", label: "Action" },
  { key: "resource", label: "Resource" },
  { key: "timestamp", label: "Time" },
  {
    key: "status",
    label: "Status",
    render: (val: string) => <Badge label={val} variant={auditStatusVariant(val)} />,
  },
];

export default function DashboardPage() {
  const activeUsers = users.filter((u) => u.status === "active").length;
  const pendingRequests = accessRequests.filter((r) => r.status === "pending").length;
  const recentActivity = auditLogs.slice(0, 5);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back, Alice. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={users.length}
          description="Across all departments"
          trend={{ value: 12, label: "this month" }}
          icon={<UsersIcon />}
        />
        <StatCard
          title="Active Users"
          value={activeUsers}
          description={`${users.length - activeUsers} inactive or suspended`}
          trend={{ value: 4, label: "vs last week" }}
          icon={<ActivityIcon />}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests}
          description="Awaiting review"
          trend={{ value: -8, label: "vs yesterday" }}
          icon={<ClockIcon />}
        />
        <StatCard
          title="Total Roles"
          value={roles.length}
          description="Defined access levels"
          icon={<ShieldIcon />}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Recent Activity</h2>
          <a href="/audit-log" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            View all →
          </a>
        </div>
        <DataTable columns={recentAuditColumns} data={recentActivity} />
      </div>
    </div>
  );
}
