import { Injectable, signal } from '@angular/core';
import { Transaction, CreateTransactionDto } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly STORAGE_KEY = 'moein_transactions';
  private transactionsSignal = signal<Transaction[]>([]);
  
  transactions = this.transactionsSignal.asReadonly();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const transactions = JSON.parse(data);
        this.transactionsSignal.set(transactions);
      }
    } catch (error) {
      console.error('Error loading transactions from storage:', error);
    }
  }

  private saveToStorage(transactions: Transaction[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions to storage:', error);
    }
  }

  getAllTransactions(): Transaction[] {
    return this.transactionsSignal();
  }

  getTransactionsByPersonId(personId: string): Transaction[] {
    return this.transactionsSignal()
      .filter(t => t.personId === personId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getTransactionById(id: string): Transaction | undefined {
    return this.transactionsSignal().find(t => t.id === id);
  }

  addTransaction(dto: CreateTransactionDto): Transaction {
    const newTransaction: Transaction = {
      ...dto,
      id: this.generateId(),
      createdAt: new Date()
    };
    
    const updatedTransactions = [...this.transactionsSignal(), newTransaction];
    this.transactionsSignal.set(updatedTransactions);
    this.saveToStorage(updatedTransactions);
    
    return newTransaction;
  }

  updateTransaction(id: string, dto: Partial<CreateTransactionDto>): Transaction | null {
    const transactions = this.transactionsSignal();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    const updatedTransaction = { ...transactions[index], ...dto };
    const updatedTransactions = [...transactions];
    updatedTransactions[index] = updatedTransaction;
    
    this.transactionsSignal.set(updatedTransactions);
    this.saveToStorage(updatedTransactions);
    
    return updatedTransaction;
  }

  deleteTransaction(id: string): boolean {
    const transactions = this.transactionsSignal();
    const filteredTransactions = transactions.filter(t => t.id !== id);
    
    if (filteredTransactions.length === transactions.length) return false;
    
    this.transactionsSignal.set(filteredTransactions);
    this.saveToStorage(filteredTransactions);
    
    return true;
  }

  deleteTransactionsByPersonId(personId: string): void {
    const transactions = this.transactionsSignal();
    const filteredTransactions = transactions.filter(t => t.personId !== personId);
    
    this.transactionsSignal.set(filteredTransactions);
    this.saveToStorage(filteredTransactions);
  }

  calculateBalance(personId: string): number {
    return this.getTransactionsByPersonId(personId).reduce((total, t) => {
      return total + (t.type === 'debit' ? -t.amount : t.amount);
    }, 0);
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
