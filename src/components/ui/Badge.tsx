type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  error: "bg-red-500/20 text-red-400 border border-red-500/30",
  info: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  neutral: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
};

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export default function Badge({ label, variant = "neutral" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}>
      {label}
    </span>
  );
}
