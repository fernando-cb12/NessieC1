import React, { useState, useEffect } from "react";
import { Plus, Wallet } from "lucide-react";
import AccountCard from "../../components/AccountCard/AccountCard";
import styles from "./Accounts.module.css";
import type { Account } from "../../types";
import { fetchAccounts } from "../../api/Accounts";
import FinanceAgent from "../../components/FinanceAgent/FinanceAgent";

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch accounts from Nessie API
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAccounts();
      setAccounts(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  // Calculate total balance
  const calculateTotalBalance = (): number => {
    return accounts.reduce((total, account) => {
      // For credit cards, subtract the balance (since it's a negative value representing debt)
      return total + account.balance;
    }, 0);
  };

  const handleAddAccount = () => {
    // Placeholder for future functionality
    console.log("Add account clicked");
  };

  if (loading) {
    return (
      <div className={styles.accountsContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.accountsContainer}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <Wallet size={40} />
          </div>
          <h3 className={styles.emptyStateTitle}>Error Loading Accounts</h3>
          <p className={styles.emptyStateText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.accountsContainer}>
      {/* Page Header */}
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Accounts</h1>
        <p className={styles.pageSubtitle}>Manage your finances in one place</p>
      </header>

      {/* Finance Assistant */}
      <FinanceAgent route="accounts" />

      {/* Summary Card */}
      {accounts.length > 0 && (
        <div className={styles.summaryCard}>
          <div className={styles.summaryTitle}>Total Balance</div>
          <div className={styles.totalBalance}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
            }).format(calculateTotalBalance())}
          </div>
          <div className={styles.accountCount}>
            {accounts.length} {accounts.length === 1 ? "Account" : "Accounts"}
          </div>
        </div>
      )}

      {/* Accounts List */}
      {accounts.length > 0 ? (
        <div className={styles.accountsList}>
          {accounts.map((account) => (
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
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <Wallet size={40} />
          </div>
          <h3 className={styles.emptyStateTitle}>No Accounts Yet</h3>
          <p className={styles.emptyStateText}>
            Get started by adding your first account
          </p>
        </div>
      )}

      {/* Add Account Button */}
      <button
        className={styles.addButton}
        onClick={handleAddAccount}
        aria-label="Add new account"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default Accounts;
