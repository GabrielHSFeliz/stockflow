const LOW_STOCK_THRESHOLD = 15;
const MAX_REFERENCE = 60;

export function StockGauge({ current }: { current: number }) {
  const pct = Math.min(100, Math.round((current / MAX_REFERENCE) * 100));
  const isLow = current <= LOW_STOCK_THRESHOLD;

  return (
    <div className="flex items-center gap-2" title={`${current} unidades em estoque`}>
      <div className="relative h-8 w-1.5 overflow-hidden rounded-full bg-graphite-700">
        <div
          className={`absolute bottom-0 w-full rounded-full transition-all ${
            isLow ? "bg-brick" : "bg-slate-teal"
          }`}
          style={{ height: `${Math.max(6, pct)}%` }}
        />
      </div>
      <span className={`font-mono text-sm ${isLow ? "text-brick" : "text-ink-300"}`}>
        {current}
      </span>
    </div>
  );
}