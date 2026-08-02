import type { DashboardSummary } from "../types";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function SummaryCards({ summary }: { summary: DashboardSummary }) {
  const cards = [
    {
      label: "Valor em estoque",
      value: formatBRL(summary.total_stock_value),
      hint: "reposição · valor cheio",
      accent: "text-slate-teal",
    },
    {
      label: "Custo de aquisição",
      value: formatBRL(summary.total_cost_in),
      hint: "custo de entrada dos itens",
      accent: "text-ink-100",
    },
    {
      label: "Custo de entregas",
      value: formatBRL(summary.total_delivery_cost),
      hint: `${summary.total_requisitions} requisições no período`,
      accent: "text-copper",
    },
    {
      label: "Itens em alerta",
      value: String(summary.low_stock_items),
      hint: `${summary.pending_requisitions} pendentes de aprovação`,
      accent: summary.low_stock_items > 0 ? "text-brick" : "text-ink-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="glass-panel rounded-2xl p-5 shadow-lg shadow-black/20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
            {card.label}
          </p>
          <p className={`mt-2 font-display text-2xl font-semibold ${card.accent}`}>
            {card.value}
          </p>
          <p className="mt-1 text-xs text-ink-500">{card.hint}</p>
        </div>
      ))}
    </div>
  );
}