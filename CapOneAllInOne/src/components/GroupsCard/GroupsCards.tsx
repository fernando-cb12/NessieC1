import React, { useState } from "react";
import { Users, ChevronDown, DollarSign, Calendar, Settings, Bell, ArrowUp, BookCheck, ArrowUpFromLine, ArrowLeftRight, Receipt} from "lucide-react";
import type { Group } from "../../types.d";
import styles from "./GroupsCard.module.css";

interface GroupsCardProps {
  group: Group;
}

const GroupsCard: React.FC<GroupsCardProps> = ({ group }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getGroupIcon = (type: string) => {
    switch (type) {
      case 'company':
        return '🏢';
      case 'job':
        return '💼';
      case 'business':
        return '📈';
      case 'friends':
        return '👥';
      case 'family':
        return '👨‍👩‍👧‍👦';
      default:
        return '👥';
    }
  };

  const getGroupColor = (type: string) => {
    switch (type) {
      case 'company':
        return 'var(--capital-one-blue)';
      case 'job':
        return '#2E7D32';
      case 'business':
        return '#FF6F00';
      case 'friends':
        return '#7B1FA2';
      case 'family':
        return '#D32F2F';
      default:
        return 'var(--capital-one-blue)';
    }
  };

  return (
    <div
      className={`${styles.groupsCard} ${isExpanded ? styles.expanded : ""}`}
      onClick={toggleExpanded}
    >
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.groupInfo}>
          <div className={styles.groupType}>
            <span className={styles.groupIcon}>{getGroupIcon(group.type)}</span>
            <span className={styles.typeLabel}>{group.type.toUpperCase()}</span>
          </div>
          <h3 className={styles.groupName}>{group.name}</h3>
          <div className={styles.groupDescription}>{group.description}</div>
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
            <div className={styles.balanceLabel}>Total Group Balance</div>
            <div 
              className={styles.balanceAmount}
              style={{ color: getGroupColor(group.type) }}
            >
              {formatCurrency(group.totalBalance)}
            </div>
          </div>
        </>
      )}

      {/* Members Section - Only shown when expanded */}
      {isExpanded && (
        <>
          <div className={styles.divider} />
          <div className={styles.membersSection}>
            <div className={styles.sectionHeader}>
              <Users size={16} />
              <span>Members ({group.members.length})</span>
            </div>
            <div className={styles.membersList}>
              {group.members.map((member) => (
                <div key={member.id} className={styles.memberItem}>
                  <div className={styles.memberAvatar}>
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} />
                    ) : (
                      <span>{member.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className={styles.memberInfo}>
                    <span className={styles.memberName}>{member.name}</span>
                    <span className={styles.memberRole}>{member.role}</span>
                    <span className={styles.memberEmail}>{member.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Shared Accounts Section - Only shown when expanded */}
      {isExpanded && group.sharedAccounts.length > 0 && (
        <>
          <div className={styles.divider} />
          <div className={styles.accountsSection}>
            <div className={styles.sectionHeader}>
              <DollarSign size={16} />
              <span>Shared Accounts ({group.sharedAccounts.length})</span>
            </div>
            <div className={styles.accountsList}>
              {group.sharedAccounts.map((account) => (
                <div key={account.id} className={styles.accountItem}>
                  <div className={styles.accountInfo}>
                    <span className={styles.accountName}>{account.nickname}</span>
                    <span className={styles.accountType}>{account.accountType}</span>
                    <span className={styles.accountNumber}>{account.accountNumber}</span>
                    <div className={styles.permissions}>
                      {account.permissions.map((permission) => (
                        <span key={permission} className={styles.permissionTag}>
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.accountBalance}>
                    {formatCurrency(account.balance)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Group Settings Section - Only shown when expanded */}
      {isExpanded && (
        <>
          <div className={styles.divider} />
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <Settings size={16} />
              <span>Group Settings</span>
            </div>
            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>Visibility:</span>
                <span className={styles.settingValue}>{group.settings.visibility}</span>
              </div>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>Member Invites:</span>
                <span className={styles.settingValue}>
                  {group.settings.allowMemberInvites ? "Allowed" : "Restricted"}
                </span>
              </div>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>Approval Required:</span>
                <span className={styles.settingValue}>
                  {group.settings.requireApproval ? "Yes" : "No"}
                </span>
              </div>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>Created:</span>
                <span className={styles.settingValue}>{formatDate(group.createdAt)}</span>
              </div>
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
              onClick={(e) => {
                e.stopPropagation();
                console.log("Manage group");
              }}
              aria-label="Manage group"
            >
              <Receipt size={20} />
            </button>
            <button
              className={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                console.log("View transactions");
              }}
              aria-label="View transactions"
            >
               <Bell size={20} />
            </button>
            <button
              className={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                console.log("View members");
              }}
              aria-label="View members"
            >
              <ArrowLeftRight size={20} />
            </button>
            <button
              className={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                console.log("Add member");
              }}
              aria-label="Add member"
            >
              <BookCheck size={20} />
            </button>
            <button
              className={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                console.log("View analytics");
              }}
              aria-label="View analytics"
            >
              <ArrowUp size={20} />
            </button>
            <button
              className={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                console.log("Export data");
              }}
              aria-label="Export data"
            >
              <ArrowUpFromLine size={20} />
            </button>
          </div>
        </>
      )}

      {/* Metadata - Only shown when not expanded */}
      {!isExpanded && (
        <>
          <div className={styles.divider} />
          <div className={styles.metadata}>
            <div className={styles.metadataItem}>
              <Users size={12} />
              <span>{group.members.length} members</span>
            </div>
            <div className={styles.metadataItem}>
              <Calendar size={12} />
              <span>Updated {formatDate(group.lastActivity)}</span>
            </div>
          </div>
        </>
      )}

      {/* Group Type Badge */}
      <div 
        className={styles.typeBadge}
        style={{ backgroundColor: getGroupColor(group.type) }}
      >
        {group.type}
      </div>
    </div>
  );
};

export default GroupsCard;
