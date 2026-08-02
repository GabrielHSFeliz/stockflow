export type Role = "TL" | "ADMIN_MASTER";
export type Status = "PENDING" | "APPROVED" | "DELIVERED" | "REJECTED";

export interface Employee {
  id: number;
  name: string;
  role: Role;
  area: string;
}

export interface Item {
  id: number;
  sku: string;
  name: string;
  size: string;
  current_stock: number;
  unit_cost_in: number;
  unit_value: number;
}

export interface Requisition {
  id: number;
  quantity: number;
  status: Status;
  delivery_cost: number;
  requested_at: string;
  delivered_at: string | null;
  notes: string | null;
  employee: Employee;
  item: Item;
}

export interface DashboardSummary {
  total_stock_value: number;
  total_cost_in: number;
  total_delivery_cost: number;
  total_requisitions: number;
  pending_requisitions: number;
  low_stock_items: number;
}