interface Account {
  _id: string;
  type: string;
  nickname: string;
  rewards: number;
  balance: number;
  account_number: string;
  customer_id: string;
}

interface StockPosition {
  symbol: string;
  qty: number;
  avg_entry_price: number;
  current_price: number;
  market_value: number;
  cost_basis: number;
  unrealized_pl: number;
  unrealized_plpc: number;
  side: "long" | "short";
}

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
}

interface GroupMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar?: string;
}

interface SharedAccount {
  id: string;
  accountType: string;
  nickname: string;
  balance: number;
  accountNumber: string;
  permissions: string[];
}

interface Group {
  id: string;
  name: string;
  description: string;
  type: 'company' | 'job' | 'business' | 'friends' | 'family';
  icon: string;
  color: string;
  members: GroupMember[];
  sharedAccounts: SharedAccount[];
  totalBalance: number;
  createdAt: string;
  lastActivity: string;
  settings: {
    allowMemberInvites: boolean;
    requireApproval: boolean;
    visibility: 'private' | 'public';
  };
}

export type { Account, Group, GroupMember, SharedAccount, StockPosition, MarketData  };
