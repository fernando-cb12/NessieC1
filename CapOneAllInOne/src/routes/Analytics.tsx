import React, { useEffect, useMemo, useState } from "react";
import { Wallet } from "lucide-react";
import styles from "./Analytics.module.css";
import { fetchAccounts } from "../api/Accounts";
import type { Account } from "../types";

// Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import FinanceAgent from "../components/FinanceAgent/FinanceAgent";

const fmtMoney = (v: number) =>
  v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

const PIE_COLORS = [
  "#2563eb",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#14b8a6",
  "#e11d48",
];

function lastNMonthsLabels(n = 6): string[] {
  const labels: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
    labels.push(
      `${dt.toLocaleString("en-US", { month: "short" })} ${dt.getFullYear()}`
    );
  }
  return labels;
}

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const accs = await fetchAccounts();
        setAccounts(accs);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + (a.balance ?? 0), 0),
    [accounts]
  );

  const balanceByAccount = useMemo(() => {
    return accounts.map((a) => ({
      name: a.nickname || `${a.type} •••${a.account_number?.slice(-4)}`,
      balance: a.balance ?? 0,
    }));
  }, [accounts]);

  const typeDistribution = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of accounts) {
      map.set(a.type, (map.get(a.type) || 0) + (a.balance ?? 0));
    }
    return [...map.entries()].map(([category, amount]) => ({
      category,
      amount,
    }));
  }, [accounts]);

  const netWorthSeries = useMemo(() => {
    const months = lastNMonthsLabels(6);
    const now = totalBalance;
    // demo: pequeña deriva + “wobble” determinista
    return months.map((m, idx) => {
      const drift = 0.004; // ~0.4% mensual
      const wobble = (idx % 2 === 0 ? 0.003 : -0.002) * (idx / months.length);
      const factor = 1 + idx * (drift + wobble);
      return { date: m, netWorth: Math.max(0, now * factor) };
    });
  }, [totalBalance]);

  if (loading) {
    return (
      <div className={styles.analyticsContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.analyticsContainer}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <Wallet size={40} />
          </div>
          <h3 className={styles.emptyStateTitle}>Error Loading Analytics</h3>
          <p className={styles.emptyStateText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.analyticsContainer}>
      {/* Header (mismo estilo que Accounts/Groups) */}
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Analytics</h1>
        <p className={styles.pageSubtitle}>
          Visualize your personal finance insights
        </p>
      </header>
      <FinanceAgent route="home" />
      {/* Summary card arriba (como Accounts) */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryTitle}>Total Balance</div>
        <div className={styles.totalBalance}>{fmtMoney(totalBalance)}</div>
        <div className={styles.accountCount}>
          {accounts.length} {accounts.length === 1 ? "Account" : "Accounts"}
        </div>
      </div>

      {/* Cards con charts */}
      <section className={styles.cardsGrid}>
        {/* Balance por cuenta */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Balance by Account</h2>
          <div className={styles.chartBox}>
            <ResponsiveContainer>
              <BarChart
                data={balanceByAccount}
                margin={{ top: 10, right: 18, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
                  }
                />
                <Tooltip
                  formatter={(v: any) => [fmtMoney(Number(v)), "Balance"]}
                />
                <Legend />
                <Bar
                  dataKey="balance"
                  name="Balance"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución por tipo */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Distribution by Account Type</h2>
          <div className={styles.chartBox}>
            <ResponsiveContainer>
              <PieChart>
                <Tooltip
                  formatter={(v: any) => [fmtMoney(Number(v)), "Amount"]}
                />
                <Legend />
                <Pie
                  data={typeDistribution}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {typeDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patrimonio neto */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Net Worth</h2>
          <div className={styles.chartBox}>
            <ResponsiveContainer>
              <AreaChart
                data={netWorthSeries}
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
                <Tooltip
                  formatter={(v: any) => [fmtMoney(Number(v)), "Net Worth"]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="netWorth"
                  name="Net Worth"
                  stroke="#0ea5e9"
                  fill="url(#nw)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
