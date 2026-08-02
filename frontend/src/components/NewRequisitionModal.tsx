import { useState } from "react";
import { X } from "lucide-react";
import type { Item } from "../types";
import { StockGauge } from "./StockGauge";

export function NewRequisitionModal({
  items,
  onClose,
  onSubmit,
}: {
  items: Item[];
  onClose: () => void;
  onSubmit: (payload: { item_id: number; quantity: number; notes?: string }) => Promise<void>;
}) {
  const [itemId, setItemId] = useState<number>(items[0]?.id ?? 0);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedItem = items.find((i) => i.id === itemId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!itemId || quantity < 1) return;
    setSubmitting(true);
    try {
      await onSubmit({ item_id: itemId, quantity, notes: notes || undefined });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-graphite-950/70 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="glass-panel-solid relative w-full max-w-md rounded-2xl p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-ink-500">
              Nova requisição
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink-100">
              Solicitar uniforme
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-500 transition hover:bg-graphite-800 hover:text-ink-100"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-500">
              Item
            </label>
            <select
              value={itemId}
              onChange={(e) => setItemId(Number(e.target.value))}
              className="w-full rounded-xl border border-graphite-700/60 bg-graphite-800/70 px-3 py-2.5 text-sm text-ink-100 focus:border-copper/50"
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.size} ({item.sku})
                </option>
              ))}
            </select>
            {selectedItem && (
              <div className="mt-2 flex items-center justify-between rounded-lg bg-graphite-800/40 px-3 py-2">
                <span className="text-xs text-ink-500">Estoque atual</span>
                <StockGauge current={selectedItem.current_stock} />
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-500">
              Quantidade
            </label>
            <input
              type="number"
              min={1}
              max={selectedItem?.current_stock ?? 1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-xl border border-graphite-700/60 bg-graphite-800/70 px-3 py-2.5 text-sm font-mono text-ink-100 focus:border-copper/50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-500">
              Observações (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Ex.: reposição por desgaste, novo colaborador..."
              className="w-full resize-none rounded-xl border border-graphite-700/60 bg-graphite-800/70 px-3 py-2.5 text-sm text-ink-100 placeholder:text-ink-700 focus:border-copper/50"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-graphite-700/60 px-4 py-2.5 text-sm text-ink-300 transition hover:bg-graphite-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || !itemId}
            className="flex-1 rounded-xl bg-copper px-4 py-2.5 text-sm font-medium text-graphite-950 transition hover:bg-copper/90 disabled:opacity-50"
          >
            {submitting ? "Enviando..." : "Enviar requisição"}
          </button>
        </div>
      </form>
    </div>
  );
}