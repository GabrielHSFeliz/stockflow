import { useEffect, useState } from "react";
import { Plus, Package } from "lucide-react";
import { api } from "./api";
import type { DashboardSummary, Employee, Item, Requisition, Status } from "./types";
import { ParticleField } from "./components/ParticleField";
import { SummaryCards } from "./components/SummaryCards";
import { DashboardCharts } from "./components/DashboardCharts";
import { EmployeeSwitcher } from "./components/EmployeeSwitcher";
import { RequisitionTable } from "./components/RequisitionTable";
import { RequisitionDrawer } from "./components/RequisitionDrawer";
import { NewRequisitionModal } from "./components/NewRequisitionModal";

const STATUS_FILTERS: { label: string; value: Status | "ALL" }[] = [
  { label: "Todas", value: "ALL" },
  { label: "Pendentes", value: "PENDING" },
  { label: "Aprovadas", value: "APPROVED" },
  { label: "Entregues", value: "DELIVERED" },
  { label: "Recusadas", value: "REJECTED" },
];

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [current, setCurrent] = useState<Employee | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
  const [selected, setSelected] = useState<Requisition | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function bootstrap() {
      try {
        const [emps, its] = await Promise.all([api.listEmployees(), api.listItems()]);
        setEmployees(emps);
        setItems(its);
        setCurrent(emps.find((e) => e.role === "ADMIN_MASTER") ?? emps[0]);
      } catch {
        setError("Não foi possível conectar à API. Confira se o backend está rodando.");
      }
    }
    bootstrap();
  }, []);

  useEffect(() => {
    if (!current) return;
    const employeeId = current.id;

    async function loadRequisitions() {
      setLoading(true);
      try {
        const [reqs, sum] = await Promise.all([
          api.listRequisitions(employeeId, statusFilter === "ALL" ? undefined : statusFilter),
          api.dashboardSummary(employeeId),
        ]);
        setRequisitions(reqs);
        setSummary(sum);
        setError(null);
      } catch {
        setError("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    loadRequisitions();
  }, [current, statusFilter]);

  async function refreshData() {
    if (!current) return;
    const [reqs, sum] = await Promise.all([
      api.listRequisitions(current.id, statusFilter === "ALL" ? undefined : statusFilter),
      api.dashboardSummary(current.id),
    ]);
    setRequisitions(reqs);
    setSummary(sum);
  }

  async function handleUpdateStatus(id: number, status: Status) {
    await api.updateStatus(id, status);
    setSelected(null);
    await refreshData();
  }

  async function handleCreate(payload: { item_id: number; quantity: number; notes?: string }) {
    if (!current) return;
    await api.createRequisition({ employee_id: current.id, ...payload });
    await refreshData();
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center px-6 text-center">
        <div>
          <p className="font-display text-lg text-brick">{error}</p>
          <p className="mt-2 text-sm text-ink-500">
            Rode <code className="font-mono text-ink-300">uvicorn main:app --reload</code> na
            pasta backend.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <ParticleField />

      <div className="relative z-10">
        <header className="rack-rail border-b border-graphite-700/40 px-6 py-6 sm:px-10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-copper/15 text-copper">
                <Package size={20} />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold leading-tight text-ink-100">
                  StockFlow
                </h1>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
                  Controle de uniformes · BRSP11
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNewModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-copper px-4 py-2 text-sm font-medium text-graphite-950 transition hover:bg-copper/90"
              >
                <Plus size={16} />
                Nova requisição
              </button>
              <EmployeeSwitcher employees={employees} current={current} onChange={setCurrent} />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
          {summary && (
            <div className="mb-8">
              <SummaryCards summary={summary} />
            </div>
          )}

          <div className="mb-8">
            <DashboardCharts requisitions={requisitions} items={items} />
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    statusFilter === filter.value
                      ? "bg-copper text-graphite-950"
                      : "border border-graphite-700/60 text-ink-300 hover:bg-graphite-800"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            {current?.role === "ADMIN_MASTER" && (
              <p className="font-mono text-[11px] uppercase tracking-wide text-ink-500">
                visão admin · todas as áreas
              </p>
            )}
          </div>

          {loading ? (
            <div className="glass-panel rounded-2xl py-16 text-center text-ink-500">
              Carregando requisições...
            </div>
          ) : (
            <RequisitionTable
              requisitions={requisitions}
              onSelect={setSelected}
              showRequester={current?.role === "ADMIN_MASTER"}
            />
          )}
        </main>
      </div>

      <RequisitionDrawer
        requisition={selected}
        canManage={current?.role === "ADMIN_MASTER"}
        onClose={() => setSelected(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {showNewModal && (
        <NewRequisitionModal
          items={items}
          onClose={() => setShowNewModal(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}