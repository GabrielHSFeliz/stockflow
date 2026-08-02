import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import type { Item, Requisition, Status } from "../types";

const STATUS_COLORS: Record<Status, string> = {
  PENDING: "#c87f4a",
  APPROVED: "#5c8a86",
  DELIVERED: "#8c857c",
  REJECTED: "#a8503f",
};

const STATUS_LABELS: Record<Status, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  DELIVERED: "Entregue",
  REJECTED: "Recusada",
};

const LOW_STOCK_THRESHOLD = 15;

interface TooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-graphite-700/60 bg-graphite-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur-md">
      {label && <p className="mb-1 font-mono text-ink-500">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} className="text-ink-100">
          {entry.name}: <span className="font-mono">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export function DashboardCharts({
  requisitions,
  items,
}: {
  requisitions: Requisition[];
  items: Item[];
}) {
  const statusData = (Object.keys(STATUS_LABELS) as Status[])
    .map((status) => ({
      name: STATUS_LABELS[status],
      value: requisitions.filter((r) => r.status === status).length,
      color: STATUS_COLORS[status],
    }))
    .filter((d) => d.value > 0);

  const stockData = items.map((item) => ({
    name: `${item.sku}`,
    estoque: item.current_stock,
    isLow: item.current_stock <= LOW_STOCK_THRESHOLD,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div className="glass-panel rounded-2xl p-5 lg:col-span-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
          Estoque por item
        </p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2b2b2f" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#8c857c", fontSize: 10, fontFamily: "JetBrains Mono" }}
                axisLine={{ stroke: "#2b2b2f" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8c857c", fontSize: 11 }}
                axisLine={{ stroke: "#2b2b2f" }}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="estoque" radius={[6, 6, 0, 0]}>
                {stockData.map((entry, i) => (
                  <Cell key={i} fill={entry.isLow ? "#a8503f" : "#5c8a86"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5 lg:col-span-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
          Requisições por status
        </p>
        <div className="mt-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs text-ink-300">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}