interface Account {
  _id: string;
  type: string;
  nickname: string;
  rewards: number;
  balance: number;
  account_number: string;
  customer_id: string;
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

export type { Account, Group, GroupMember, SharedAccount };
