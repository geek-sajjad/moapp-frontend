export interface Transaction {
  id: string;
  personId: string;
  transactionDate: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  createdAt: Date;
}

export interface CreateTransactionDto {
  personId: string;
  transactionDate: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
}

export interface TransactionFormData {
  transactionDate: string;
  type: 'debit' | 'credit';
  amount: string;
  description: string;
}
