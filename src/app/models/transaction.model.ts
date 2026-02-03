export interface Transaction {
  id: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  date: string;
  description: string;
  userId: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  date: string;
  description: string;
  customerId: string;
}

export interface TransactionSummary {
  totalBalance: number;
  totalType: 'CREDIT' | 'DEBIT';
  totalTransactions: number;
}

export interface TransactionFormData {
  transactionDate: string;
  type: 'CREDIT' | 'DEBIT';
  amount: string;
  description: string;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: number;
    date: string;
  };
}
