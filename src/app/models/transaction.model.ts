export interface Transaction {
  id: string;
  personId: string;
  date: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  createdAt: Date;
}

export interface CreateTransactionDto {
  personId: string;
  date: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
}
