import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Transaction,
  CreateTransactionDto,
  TransactionSummary,
  ApiResponse,
} from '../models/transaction.model';

/**
 * Transaction Service - Handles all transaction-related API calls
 *
 * Available Endpoints:
 * 1. POST /transactions - Create a new transaction
 * 2. GET /transactions/customer/{customerId} - Get all transactions for a customer
 * 3. GET /transactions/customer/{customerId}/summary - Get transaction summary for a customer
 *
 * Usage Example:
 * ```typescript
 * // Create a transaction
 * const dto: CreateTransactionDto = {
 *   customerId: '123e4567-e89b-12d3-a456-426614174000',
 *   amount: 50000,
 *   type: 'CREDIT', // or 'DEBIT'
 *   date: '2024-01-15',
 *   description: 'Payment for lunch'
 * };
 * this.transactionService.createTransaction(dto).subscribe(transaction => {
 *   console.log('Transaction created:', transaction);
 * });
 *
 * // Get customer transactions
 * this.transactionService.getCustomerTransactions(customerId).subscribe(transactions => {
 *   console.log('Transactions:', transactions);
 * });
 *
 * // Get transaction summary
 * this.transactionService.getTransactionSummary(customerId).subscribe(summary => {
 *   console.log('Summary:', summary);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly API_URL = `${environment.apiUrl}/transactions`;

  // Signal to store transactions list for a specific customer
  private transactionsSignal = signal<Transaction[]>([]);
  transactions = this.transactionsSignal.asReadonly();

  // Signal to store transaction summary
  private summarySignal = signal<TransactionSummary | null>(null);
  summary = this.summarySignal.asReadonly();

  constructor(private http: HttpClient) {}

  /**
   * Create a new transaction
   * POST /transactions
   */
  createTransaction(dto: CreateTransactionDto): Observable<Transaction> {
    return this.http.post<ApiResponse<Transaction>>(this.API_URL, dto).pipe(
      tap((response) => {
        const newTransaction = response.data;
        const currentTransactions = this.transactionsSignal() || [];
        this.transactionsSignal.set([newTransaction, ...currentTransactions]);
      }),
      tap(() => {
        // Refresh summary after creating a transaction
        this.getTransactionSummary(dto.customerId).subscribe();
      }),
      // Extract the data from the response
      map((response) => response.data),
    );
  }

  /**
   * Get all transactions for a specific customer
   * GET /transactions/customer/{customerId}
   */
  getCustomerTransactions(customerId: string): Observable<Transaction[]> {
    return this.http.get<ApiResponse<Transaction[]>>(`${this.API_URL}/customer/${customerId}`).pipe(
      tap((response) => {
        this.transactionsSignal.set(response.data || []);
      }),
      // Extract the data from the response
      map((response) => response.data || []),
    );
  }

  /**
   * Get transaction summary for a customer
   * GET /transactions/customer/{customerId}/summary
   */
  getTransactionSummary(customerId: string): Observable<TransactionSummary> {
    return this.http
      .get<ApiResponse<TransactionSummary>>(`${this.API_URL}/customer/${customerId}/summary`)
      .pipe(
        tap((response) => {
          this.summarySignal.set(response.data);
        }),
        // Extract the data from the response
        map((response) => response.data),
      );
  }

  /**
   * Get transactions from signal (local state)
   */
  getTransactionsByCustomerId(customerId: string): Transaction[] {
    const transactions = this.transactionsSignal() || [];
    return transactions
      .filter((t) => t.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get a single transaction by ID from signal
   */
  getTransactionById(id: string): Transaction | undefined {
    const transactions = this.transactionsSignal() || [];
    return transactions.find((t) => t.id === id);
  }

  /**
   * Calculate balance from local transactions (fallback method)
   */
  calculateBalance(customerId: string): number {
    const transactions = this.getTransactionsByCustomerId(customerId);
    return transactions.reduce((total, t) => {
      return total + (t.type === 'DEBIT' ? -t.amount : t.amount);
    }, 0);
  }

  /**
   * Clear local transaction state
   */
  clearTransactions(): void {
    this.transactionsSignal.set([]);
    this.summarySignal.set(null);
  }
}
