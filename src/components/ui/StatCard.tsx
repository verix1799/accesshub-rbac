interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: { value: number; label: string };
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, description, trend, icon }: StatCardProps) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trend.value >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2.5 bg-indigo-600/20 rounded-lg text-indigo-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
