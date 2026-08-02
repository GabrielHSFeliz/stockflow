import type { Requisition } from "../types";
import { StatusBadge } from "./StatusBadge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function RequisitionTable({
  requisitions,
  onSelect,
  showRequester,
}: {
  requisitions: Requisition[];
  onSelect: (req: Requisition) => void;
  showRequester: boolean;
}) {
  if (requisitions.length === 0) {
    return (
      <div className="glass-panel flex flex-col items-center justify-center rounded-2xl py-16 text-center">
        <p className="font-display text-lg text-ink-300">Nenhuma requisição por aqui</p>
        <p className="mt-1 text-sm text-ink-500">
          Ajuste os filtros ou registre uma nova requisição de uniforme.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden rounded-2xl">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-graphite-700/50 text-[11px] uppercase tracking-[0.12em] text-ink-500">
            <th className="px-5 py-3 font-mono font-normal">SKU</th>
            <th className="px-5 py-3 font-normal">Item</th>
            {showRequester && <th className="px-5 py-3 font-normal">Solicitante</th>}
            <th className="px-5 py-3 font-normal">Qtd.</th>
            <th className="px-5 py-3 font-normal">Status</th>
            <th className="px-5 py-3 font-normal">Data</th>
          </tr>
        </thead>
        <tbody>
          {requisitions.map((req) => (
            <tr
              key={req.id}
              onClick={() => onSelect(req)}
              className="cursor-pointer border-b border-graphite-700/25 transition hover:bg-graphite-800/60 last:border-0"
            >
              <td className="px-5 py-3.5 font-mono text-xs text-ink-500">{req.item.sku}</td>
              <td className="px-5 py-3.5">
                <span className="font-medium text-ink-100">{req.item.name}</span>
                <span className="ml-1.5 text-xs text-ink-500">({req.item.size})</span>
              </td>
              {showRequester && (
                <td className="px-5 py-3.5 text-ink-300">{req.employee.name}</td>
              )}
              <td className="px-5 py-3.5 font-mono text-ink-300">{req.quantity}</td>
              <td className="px-5 py-3.5">
                <StatusBadge status={req.status} />
              </td>
              <td className="px-5 py-3.5 font-mono text-xs text-ink-500">
                {formatDate(req.requested_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}