import Badge from "@/components/ui/Badge";
import { roles } from "@/lib/mock-data";

const permissionVariant = (perm: string) => {
  if (perm === "delete" || perm === "manage_users" || perm === "manage_roles") return "error";
  if (perm === "write" || perm === "deploy_dev") return "warning";
  if (perm === "audit") return "info";
  return "neutral";
};

export default function RolesPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Roles</h1>
          <p className="text-gray-400 mt-1">{roles.length} roles defined in this workspace</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
          + Create Role
        </button>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {roles.map((role) => (
          <div key={role.id} className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-600/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{role.name}</h3>
                  <p className="text-xs text-gray-500">{role.userCount} users assigned</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Edit</button>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-4">{role.description}</p>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Permissions</p>
              <div className="flex flex-wrap gap-1.5">
                {role.permissions.map((perm) => (
                  <Badge key={perm} label={perm.replace("_", " ")} variant={permissionVariant(perm)} />
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
              <span>Created {role.createdAt}</span>
              <span>{role.userCount} / — users</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
