export interface Loan {
  id: string;
  amount: number;
  borrowerId: string;
  status: "pending" | "approved" | "repaid";
  createdAt: string;
}