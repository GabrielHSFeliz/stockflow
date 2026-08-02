import type { DashboardSummary, Employee, Item, Requisition, Status } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Erro ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listEmployees: () => request<Employee[]>("/employees"),
  listItems: () => request<Item[]>("/items"),
  listRequisitions: (employeeId: number, status?: Status) => {
    const params = new URLSearchParams({ employee_id: String(employeeId) });
    if (status) params.set("status", status);
    return request<Requisition[]>(`/requisitions?${params.toString()}`);
  },
  createRequisition: (payload: { employee_id: number; item_id: number; quantity: number; notes?: string }) =>
    request<Requisition>("/requisitions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateStatus: (id: number, status: Status) =>
    request<Requisition>(`/requisitions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  dashboardSummary: (employeeId: number) =>
    request<DashboardSummary>(`/dashboard/summary?employee_id=${employeeId}`),
};