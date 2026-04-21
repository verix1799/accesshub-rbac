import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import { users, User } from "@/lib/mock-data";

const statusVariant = (status: User["status"]) => {
  if (status === "active") return "success";
  if (status === "suspended") return "error";
  return "neutral";
};

const columns = [
  {
    key: "name",
    label: "Employee",
    render: (val: string, row: Record<string, unknown>) => (
      <div>
        <p className="font-medium text-white">{val}</p>
        <p className="text-xs text-gray-500">{String(row.email)}</p>
      </div>
    ),
  },
  {
    key: "title",
    label: "Title",
    render: (val: string, row: Record<string, unknown>) => (
      <div>
        <p className="text-gray-300">{val}</p>
        <p className="text-xs text-gray-600">{String(row.employeeId)}</p>
      </div>
    ),
  },
  { key: "department", label: "Department" },
  { key: "role", label: "Assigned Role" },
  {
    key: "status",
    label: "Status",
    render: (val: User["status"]) => <Badge label={val} variant={statusVariant(val)} />,
  },
  { key: "lastActive", label: "Last Active" },
  {
    key: "id",
    label: "Actions",
    render: () => (
      <div className="flex items-center gap-2">
        <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Edit</button>
        <span className="text-gray-700">·</span>
        <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Revoke</button>
      </div>
    ),
  },
];

const departments = ["Development", "Service Desk", "NOC", "SOC", "Issuer Services", "IAM"];

export default function UsersPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400 mt-1">{users.length} provisioned accounts across {departments.length} departments</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
          + Provision User
        </button>
      </div>

      {/* Status summary + department breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3 lg:grid-cols-6">
        {departments.map((dept) => {
          const count = users.filter((u) => u.department === dept).length;
          return (
            <div key={dept} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5">
              <p className="text-xs text-gray-500 truncate">{dept}</p>
              <p className="text-lg font-bold text-white mt-0.5">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mb-4">
        {(["active", "inactive", "suspended"] as const).map((s) => {
          const count = users.filter((u) => u.status === s).length;
          return (
            <div key={s} className="flex items-center gap-2">
              <Badge label={s} variant={statusVariant(s)} />
              <span className="text-sm text-gray-400">{count}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
}
