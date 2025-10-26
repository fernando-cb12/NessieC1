import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export type NetWorthPoint = { date: string; netWorth: number };

export default function NetWorthArea({ data }: { data: NetWorthPoint[] }) {
  const fmt = (v: number) =>
    v.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    });

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 18, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="nw" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
            }
          />
          <Tooltip formatter={(v: any) => [fmt(Number(v)), "Patrimonio"]} />
          <Legend />
          <Area
            type="monotone"
            dataKey="netWorth"
            name="Patrimonio"
            stroke="#0ea5e9"
            fill="url(#nw)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
