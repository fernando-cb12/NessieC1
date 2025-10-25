import GroupsCard from "../../components/GroupsCard/GroupsCards";
import type { Group } from "../../types.d";
import "./Groups.css";

export default function Groups() {
  // Sample data for different group types
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
        {
          id: "3",
          name: "Mike Chen",
          email: "mike@startup.com",
          role: "member",
        },
        {
          id: "4",
          name: "Emily Davis",
          email: "emily@startup.com",
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
        {
          id: "2",
          accountType: "Business Savings",
          nickname: "Emergency Fund",
          balance: 50000,
          accountNumber: "****5678",
          permissions: ["view"],
        },
      ],
      totalBalance: 175000,
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
        {
          id: "3",
          name: "Tommy Wilson",
          email: "tommy@email.com",
          role: "member",
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
    {
      id: "3",
      name: "Freelance Business",
      description: "Managing finances for freelance projects",
      type: "business",
      icon: "📈",
      color: "#FF6F00",
      members: [
        {
          id: "1",
          name: "Alex Rodriguez",
          email: "alex@freelance.com",
          role: "admin",
        },
        {
          id: "2",
          name: "Maria Garcia",
          email: "maria@freelance.com",
          role: "member",
        },
      ],
      sharedAccounts: [
        {
          id: "1",
          accountType: "Business Checking",
          nickname: "Client Payments",
          balance: 25000,
          accountNumber: "****3456",
          permissions: ["view", "transfer", "withdraw"],
        },
        {
          id: "2",
          accountType: "Business Savings",
          nickname: "Tax Reserve",
          balance: 12000,
          accountNumber: "****7890",
          permissions: ["view", "deposit"],
        },
        {
          id: "3",
          accountType: "Business Credit",
          nickname: "Equipment Fund",
          balance: -5000,
          accountNumber: "****2468",
          permissions: ["view"],
        },
      ],
      totalBalance: 32000,
      createdAt: "2024-01-05",
      lastActivity: "2024-01-18",
      settings: {
        allowMemberInvites: true,
        requireApproval: false,
        visibility: "private",
      },
    },
    {
      id: "4",
      name: "College Friends",
      description: "Shared expenses for our annual reunion trip",
      type: "friends",
      icon: "👥",
      color: "#7B1FA2",
      members: [
        { id: "1", name: "David Kim", email: "david@email.com", role: "admin" },
        {
          id: "2",
          name: "Jessica Brown",
          email: "jessica@email.com",
          role: "member",
        },
        {
          id: "3",
          name: "Chris Taylor",
          email: "chris@email.com",
          role: "member",
        },
        {
          id: "4",
          name: "Amanda White",
          email: "amanda@email.com",
          role: "member",
        },
        {
          id: "5",
          name: "Kevin Lee",
          email: "kevin@email.com",
          role: "member",
        },
      ],
      sharedAccounts: [
        {
          id: "1",
          accountType: "Checking",
          nickname: "Trip Expenses",
          balance: 3200,
          accountNumber: "****1357",
          permissions: ["view", "deposit"],
        },
      ],
      totalBalance: 3200,
      createdAt: "2024-01-12",
      lastActivity: "2024-01-17",
      settings: {
        allowMemberInvites: true,
        requireApproval: true,
        visibility: "private",
      },
    },
    {
      id: "5",
      name: "Marketing Department",
      description: "Department budget and expense management",
      type: "job",
      icon: "💼",
      color: "#2E7D32",
      members: [
        {
          id: "1",
          name: "Jennifer Adams",
          email: "jennifer@company.com",
          role: "admin",
        },
        {
          id: "2",
          name: "Mark Thompson",
          email: "mark@company.com",
          role: "member",
        },
        {
          id: "3",
          name: "Rachel Green",
          email: "rachel@company.com",
          role: "member",
        },
      ],
      sharedAccounts: [
        {
          id: "1",
          accountType: "Business Checking",
          nickname: "Marketing Budget",
          balance: 75000,
          accountNumber: "****9753",
          permissions: ["view", "transfer"],
        },
        {
          id: "2",
          accountType: "Business Credit",
          nickname: "Campaign Expenses",
          balance: -15000,
          accountNumber: "****8642",
          permissions: ["view"],
        },
      ],
      totalBalance: 60000,
      createdAt: "2024-01-08",
      lastActivity: "2024-01-16",
      settings: {
        allowMemberInvites: false,
        requireApproval: true,
        visibility: "private",
      },
    },
  ];

  return (
    <div className="groups-page">
      <div className="groups-header">
        <h1>Groups</h1>
        <p>Manage your group finances and shared accounts</p>
      </div>

      <div className="cards-container">
        {sampleGroups.map((group) => (
          <GroupsCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
