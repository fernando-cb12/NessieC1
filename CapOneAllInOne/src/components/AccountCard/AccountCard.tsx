import React, { useState } from "react";
import { FileText, CreditCard, ChevronDown, MoreVertical } from "lucide-react";
import styles from "./AccountCard.module.css";

interface AccountCardProps {
  accountType: string;
  accountNickname: string;
  accountNumber: string;
  balance: number;
  status?: "active" | "inactive";
  lastUpdated?: string;
}

const AccountCard: React.FC<AccountCardProps> = ({
  accountType,
  accountNickname,
  accountNumber,
  balance,
  status = "active",
  lastUpdated,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format balance as currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Mask account number (show last 4 digits)
  const maskAccountNumber = (number: string): string => {
    if (number.length <= 4) return number;
    return `•••• ${number.slice(-4)}`;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleRecordClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Record button clicked");
  };

  const handleTransactionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Transactions button clicked");
  };

  return (
    <div
      className={`${styles.accountCard} ${isExpanded ? styles.expanded : ""}`}
      onClick={toggleExpanded}
    >
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.accountInfo}>
          <div className={styles.accountType}>{accountType}</div>
          <h3 className={styles.accountNickname}>{accountNickname}</h3>
          <div className={styles.accountNumber}>
            {maskAccountNumber(accountNumber)}
          </div>
        </div>
        <div
          className={`${styles.expandIcon} ${
            isExpanded ? styles.expanded : ""
          }`}
        >
          <ChevronDown size={20} />
        </div>
      </div>

      {/* Balance Section - Only shown when expanded */}
      {isExpanded && (
        <>
          <div className={styles.divider} />
          <div className={styles.balanceSection}>
            <div className={styles.balanceLabel}>Available Balance</div>
            <div className={styles.balanceAmount}>
              {formatCurrency(balance)}
            </div>
          </div>
        </>
      )}

      {/* Action Menu - Only shown when expanded */}
      {isExpanded && (
        <>
          <div className={styles.divider} />
          <div className={styles.actionMenu}>
            <button
              className={styles.actionButton}
              onClick={handleRecordClick}
              aria-label="View records"
            >
              <FileText size={20} />
            </button>
            <button
              className={styles.actionButton}
              onClick={handleTransactionsClick}
              aria-label="View transactions"
            >
              <CreditCard size={20} />
            </button>
            <button
              className={styles.actionButton}
              onClick={handleTransactionsClick}
              aria-label="More options"
            >
              <MoreVertical size={20} />
            </button>
          </div>
        </>
      )}

      {/* Metadata - Only shown when not expanded */}
      {!isExpanded && lastUpdated && (
        <>
          <div className={styles.divider} />
          <div className={styles.metadata}>
            <span>Updated {lastUpdated}</span>
          </div>
        </>
      )}

      {status && (
        <div className={`${styles.statusBadge} ${styles[status]}`}>
          {status}
        </div>
      )}
    </div>
  );
};

export default AccountCard;
