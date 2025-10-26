import React, { useState, useEffect, useMemo } from "react";
import { Wallet, TrendingUp, Users, BarChart3, Plus, ChevronRight, Eye } from "lucide-react";
import AccountCard from "../components/AccountCard/AccountCard";
import GroupsCard from "../components/GroupsCard/GroupsCards";
import MarketItem from "../components/MarketItem/MarketItem";
import FinanceAgent from "../components/FinanceAgent/FinanceAgent";
import { fetchAccounts } from "../api/Accounts";
import { fetchMarketData } from "../api/Stocks";
import type { Account, Group, MarketData } from "../types";
import styles from "./Home.module.css";

// Sample groups data (same as in Groups.tsx)
const sampleGroups: Group[] = [
  {
    id: "1",
    name: "Tech Startup Team",
    description: "Shared accounts for our growing tech startup",
    type: "company",
    icon: "🏢",
    color: "#004879",
    members: [
      {
        id: "1",
        name: "John Smith",
        email: "john@startup.com",
        role: "admin",
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah@startup.com",
        role: "member",
      },
    ],
    sharedAccounts: [
      {
        id: "1",
        accountType: "Business Checking",
        nickname: "Main Operations",
        balance: 125000,
        accountNumber: "****1234",
        permissions: ["view", "transfer"],
      },
    ],
    totalBalance: 125000,
    createdAt: "2024-01-15",
    lastActivity: "2024-01-20",
    settings: {
      allowMemberInvites: true,
      requireApproval: true,
      visibility: "private",
    },
  },
  {
    id: "2",
    name: "Family Vacation Fund",
    description: "Saving up for our annual family vacation",
    type: "family",
    icon: "👨‍👩‍👧‍👦",
    color: "#D32F2F",
    members: [
      {
        id: "1",
        name: "Robert Wilson",
        email: "robert@email.com",
        role: "admin",
      },
      {
        id: "2",
        name: "Lisa Wilson",
        email: "lisa@email.com",
        role: "admin",
      },
    ],
    sharedAccounts: [
      {
        id: "1",
        accountType: "Savings",
        nickname: "Vacation Fund",
        balance: 8500,
        accountNumber: "****9012",
        permissions: ["view", "deposit"],
      },
    ],
    totalBalance: 8500,
    createdAt: "2024-01-10",
    lastActivity: "2024-01-19",
    settings: {
      allowMemberInvites: false,
      requireApproval: false,
      visibility: "private",
    },
  },
];

const Home: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch accounts and market data in parallel
      const [accountsData, marketDataResult] = await Promise.all([
        fetchAccounts(),
        fetchMarketData(),
      ]);
      
      setAccounts(accountsData);
      setMarketData(marketDataResult.slice(0, 4)); // Show only top 4 stocks
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  // Calculate total balance
  const totalBalance = useMemo(() => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  }, [accounts]);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get top performing stocks
  const topStocks = useMemo(() => {
    return marketData
      .filter(stock => stock.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 3);
  }, [marketData]);

  if (loading) {
    return (
      <div className={styles.homeContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.homeContainer}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>
            <Wallet size={40} />
          </div>
          <h3 className={styles.errorTitle}>Error Loading Data</h3>
          <p className={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.homeContainer}>
      {/* Welcome Header */}
      <header className={styles.welcomeHeader}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>Welcome Back!</h1>
          <p className={styles.welcomeSubtitle}>
            Here's your financial overview for today
          </p>
        </div>
        <div className={styles.welcomeActions}>
          <button className={styles.viewAllButton}>
            <Eye size={16} />
            View All
          </button>
        </div>
      </header>

      {/* Finance Assistant */}
      <FinanceAgent route="home" />

      {/* Quick Stats Grid */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Wallet size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{formatCurrency(totalBalance)}</div>
            <div className={styles.statLabel}>Total Balance</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{sampleGroups.length}</div>
            <div className={styles.statLabel}>Active Groups</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {topStocks.length > 0 ? `+${topStocks[0].changePercent.toFixed(1)}%` : "N/A"}
            </div>
            <div className={styles.statLabel}>Top Performer</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BarChart3 size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{accounts.length}</div>
            <div className={styles.statLabel}>Accounts</div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        {/* Accounts Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>My Accounts</h2>
            <button className={styles.sectionAction}>
              <ChevronRight size={16} />
            </button>
          </div>
          
          {accounts.length > 0 ? (
            <div className={styles.accountsPreview}>
              {accounts.slice(0, 2).map((account) => (
                <AccountCard
                  key={account._id}
                  accountType={account.type}
                  accountNickname={account.nickname}
                  accountNumber={account.account_number}
                  balance={account.balance}
                  status="active"
                  lastUpdated="today"
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyPreview}>
              <Wallet size={32} />
              <p>No accounts yet</p>
            </div>
          )}
        </section>

        {/* Groups Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Groups</h2>
            <button className={styles.sectionAction}>
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className={styles.groupsPreview}>
            {sampleGroups.slice(0, 2).map((group) => (
              <GroupsCard key={group.id} group={group} />
            ))}
          </div>
        </section>

        {/* Market Overview */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Market Overview</h2>
            <button className={styles.sectionAction}>
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className={styles.marketPreview}>
            {marketData.length > 0 ? (
              marketData.slice(0, 3).map((stock) => (
                <MarketItem
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.change}
                  changePercent={stock.changePercent}
                />
              ))
            ) : (
              <div className={styles.emptyPreview}>
                <TrendingUp size={32} />
                <p>Market data unavailable</p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
          </div>
          
          <div className={styles.quickActions}>
            <button className={styles.actionButton}>
              <Plus size={20} />
              <span>Add Account</span>
            </button>
            <button className={styles.actionButton}>
              <Users size={20} />
              <span>Create Group</span>
            </button>
            <button className={styles.actionButton}>
              <BarChart3 size={20} />
              <span>View Analytics</span>
            </button>
            <button className={styles.actionButton}>
              <TrendingUp size={20} />
              <span>Market Watch</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;