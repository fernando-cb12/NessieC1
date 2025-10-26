import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export type SavingsPoint = { month: string; savings: number };

export default function SavingsBar({ data }: { data: SavingsPoint[] }) {
  const fmt = (v: number) =>
    v.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    });

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 10, right: 18, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
            }
          />
          <Tooltip formatter={(v: any) => [fmt(Number(v)), "Ahorro"]} />
          <Legend />
          <Bar dataKey="savings" name="Ahorro" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
