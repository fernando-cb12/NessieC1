import type { Account } from "../types";

/**
 * Fetches all accounts for a customer
 * Currently uses mock data, but can be replaced with actual API call
 * @returns Promise<Account[]>
 */
export const fetchAccounts = async (): Promise<Account[]> => {
  // TODO: Replace with your actual API endpoint and key
  // Example: const response = await fetch(`http://api.nessieisreal.com/accounts?key=YOUR_API_KEY`);

  // Simulated data for development
  // Remove this and uncomment the API call above when ready
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockAccounts: Account[] = [
        {
          _id: "1",
          type: "Checking",
          nickname: "Primary Checking",
          rewards: 0,
          balance: 2543.75,
          account_number: "1234567890",
          customer_id: "cust_001",
        },
        {
          _id: "2",
          type: "Savings",
          nickname: "Emergency Fund",
          rewards: 0,
          balance: 15250.0,
          account_number: "0987654321",
          customer_id: "cust_001",
        },
        {
          _id: "3",
          type: "Credit Card",
          nickname: "Venture Rewards",
          rewards: 15420,
          balance: -342.18,
          account_number: "4532123456789012",
          customer_id: "cust_001",
        },
      ];

      resolve(mockAccounts);
    }, 1000);
  });

  // Actual API call (uncomment when ready):
  /*
  const response = await fetch(
    `http://api.nessieisreal.com/accounts?key=${YOUR_API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch accounts');
  }
  
  const data = await response.json();
  return data;
  */
};

/**
 * Fetches a single account by ID
 * @param accountId - The account ID
 * @returns Promise<Account>
 */
export const fetchAccountById = async (accountId: string): Promise<Account> => {
  // TODO: Implement with actual API call
  console.log("Fetching account:", accountId);
  throw new Error("Not implemented yet");
};
