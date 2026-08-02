import { ChevronDown, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import type { Employee } from "../types";

export function EmployeeSwitcher({
  employees,
  current,
  onChange,
}: {
  employees: Employee[];
  current: Employee | null;
  onChange: (employee: Employee) => void;
}) {
  const [open, setOpen] = useState(false);

  if (!current) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-graphite-700/60 bg-graphite-800/70 px-3 py-2 text-sm text-ink-100 transition hover:border-copper/40"
      >
        {current.role === "ADMIN_MASTER" ? (
          <ShieldCheck size={16} className="text-copper" />
        ) : (
          <User size={16} className="text-slate-teal" />
        )}
        <span className="text-left">
          <span className="block font-medium leading-tight">{current.name}</span>
          <span className="block font-mono text-[10px] uppercase tracking-wide text-ink-500 leading-tight">
            {current.role === "ADMIN_MASTER" ? "Admin master" : `TL · ${current.area}`}
          </span>
        </span>
        <ChevronDown size={14} className="text-ink-500" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-xl border border-graphite-700/60 bg-graphite-900/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {employees.map((emp) => (
            <button
              key={emp.id}
              onClick={() => {
                onChange(emp);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-graphite-800 ${
                emp.id === current.id ? "bg-graphite-800/80" : ""
              }`}
            >
              {emp.role === "ADMIN_MASTER" ? (
                <ShieldCheck size={14} className="text-copper shrink-0" />
              ) : (
                <User size={14} className="text-slate-teal shrink-0" />
              )}
              <span>
                <span className="block leading-tight">{emp.name}</span>
                <span className="block font-mono text-[10px] text-ink-500 leading-tight">
                  {emp.area}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}