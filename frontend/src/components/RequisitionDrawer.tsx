import { X } from "lucide-react";
import type { Requisition, Status } from "../types";
import { StatusBadge } from "./StatusBadge";

const NEXT_ACTIONS: Partial<Record<Status, { label: string; next: Status }[]>> = {
  PENDING: [
    { label: "Aprovar", next: "APPROVED" },
    { label: "Recusar", next: "REJECTED" },
  ],
  APPROVED: [{ label: "Marcar como entregue", next: "DELIVERED" }],
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function RequisitionDrawer({
  requisition,
  canManage,
  onClose,
  onUpdateStatus,
}: {
  requisition: Requisition | null;
  canManage: boolean;
  onClose: () => void;
  onUpdateStatus: (id: number, status: Status) => void;
}) {
  if (!requisition) return null;
  const actions = canManage ? NEXT_ACTIONS[requisition.status] ?? [] : [];

  return (
    <div className="fixed inset-0 z-30 flex justify-end">
      <div className="absolute inset-0 bg-graphite-950/70 backdrop-blur-sm" onClick={onClose} />
      <aside className="glass-panel-solid relative flex h-full w-full max-w-md flex-col rounded-l-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-ink-500">Requisição #{requisition.id}</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink-100">
              {requisition.item.name}
            </h2>
            <p className="text-sm text-ink-500">Tamanho {requisition.item.size}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-500 transition hover:bg-graphite-800 hover:text-ink-100"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6">
          <StatusBadge status={requisition.status} />
        </div>

        <dl className="mt-6 space-y-4 border-t border-graphite-700/50 pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-500">SKU</dt>
            <dd className="font-mono text-ink-100">{requisition.item.sku}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Quantidade</dt>
            <dd className="font-mono text-ink-100">{requisition.quantity}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Solicitante</dt>
            <dd className="text-ink-100">{requisition.employee.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Área</dt>
            <dd className="text-ink-100">{requisition.employee.area}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Solicitada em</dt>
            <dd className="text-ink-100">{formatDateTime(requisition.requested_at)}</dd>
          </div>
          {requisition.delivered_at && (
            <div className="flex justify-between">
              <dt className="text-ink-500">Entregue em</dt>
              <dd className="text-ink-100">{formatDateTime(requisition.delivered_at)}</dd>
            </div>
          )}
          {requisition.delivery_cost > 0 && (
            <div className="flex justify-between">
              <dt className="text-ink-500">Custo da entrega</dt>
              <dd className="font-mono text-copper">{formatBRL(requisition.delivery_cost)}</dd>
            </div>
          )}
          {requisition.notes && (
            <div>
              <dt className="text-ink-500">Observações</dt>
              <dd className="mt-1 rounded-lg bg-graphite-800/60 p-3 text-ink-300">
                {requisition.notes}
              </dd>
            </div>
          )}
        </dl>

        {actions.length > 0 && (
          <div className="mt-auto flex gap-3 border-t border-graphite-700/50 pt-6">
            {actions.map((action) => (
              <button
                key={action.next}
                onClick={() => onUpdateStatus(requisition.id, action.next)}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  action.next === "REJECTED"
                    ? "border border-brick/40 text-brick hover:bg-brick/10"
                    : "bg-copper text-graphite-950 hover:bg-copper/90"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}