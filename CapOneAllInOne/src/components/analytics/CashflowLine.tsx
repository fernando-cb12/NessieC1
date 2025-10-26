import React from "react";
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from "recharts";

export type CashflowPoint = { month: string; income: number; expense: number };

export default function CashflowLine({ data }: { data: CashflowPoint[] }) {
  const fmt = (v: number) =>
    v.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)} />
          <Tooltip formatter={(val, name) => [fmt(Number(val)), name === "income" ? "Ingreso" : "Gasto"]} />
          <Legend formatter={(v) => (v === "income" ? "Ingreso" : "Gasto")} />
          <Line type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
