interface Account {
  _id: string;
  type: string;
  nickname: string;
  rewards: number;
  balance: number;
  account_number: string;
  customer_id: string;
}

export type { Account };
