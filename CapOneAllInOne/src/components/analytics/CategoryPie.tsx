import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export type CategorySpend = { category: string; amount: number };

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#14b8a6",
  "#e11d48",
];

export default function CategoryPie({ data }: { data: CategorySpend[] }) {
  const fmt = (v: number) =>
    v.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    });

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <PieChart>
          <Tooltip formatter={(v: any) => [fmt(Number(v)), "Monto"]} />
          <Legend />
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
