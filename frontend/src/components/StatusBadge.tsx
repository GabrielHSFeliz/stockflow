import type { Status } from "../types";

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  PENDING: {
    label: "Pendente",
    className: "bg-copper/15 text-copper border-copper/30",
  },
  APPROVED: {
    label: "Aprovada",
    className: "bg-slate-teal/15 text-slate-teal border-slate-teal/30",
  },
  DELIVERED: {
    label: "Entregue",
    className: "bg-ink-500/15 text-ink-300 border-ink-500/30",
  },
  REJECTED: {
    label: "Recusada",
    className: "bg-brick/15 text-brick border-brick/30",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium font-mono tracking-wide ${config.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}