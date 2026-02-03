import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '../models/customer.model';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly API_URL = `${environment.apiUrl}/customers`;
  
  // Signal to store customers list
  private customersSignal = signal<Customer[]>([]);
  customers = this.customersSignal.asReadonly();

  constructor(private http: HttpClient) {}

  /**
   * Get all customers
   */
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.API_URL).pipe(
      tap(customers => {
        this.customersSignal.set(customers);
      })
    );
  }

  /**
   * Create a new customer
   */
  createCustomer(dto: CreateCustomerDto): Observable<Customer> {
    return this.http.post<Customer>(this.API_URL, dto).pipe(
      tap(newCustomer => {
        const currentCustomers = this.customersSignal();
        this.customersSignal.set([newCustomer, ...currentCustomers]);
      })
    );
  }

  /**
   * Update an existing customer
   */
  updateCustomer(id: string, dto: UpdateCustomerDto): Observable<Customer> {
    return this.http.patch<Customer>(`${this.API_URL}/${id}`, dto).pipe(
      tap(updatedCustomer => {
        const currentCustomers = this.customersSignal();
        const index = currentCustomers.findIndex(c => c.id === id);
        if (index !== -1) {
          const updatedList = [...currentCustomers];
          updatedList[index] = updatedCustomer;
          this.customersSignal.set(updatedList);
        }
      })
    );
  }

  /**
   * Delete a customer
   */
  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        const currentCustomers = this.customersSignal();
        this.customersSignal.set(currentCustomers.filter(c => c.id !== id));
      })
    );
  }

  /**
   * Get a single customer by ID
   */
  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.API_URL}/${id}`);
  }

  /**
   * Search customers locally from the signal
   */
  searchCustomers(term: string): Customer[] {
    const lowerTerm = term.toLowerCase();
    return this.customersSignal().filter(c => 
      c.name.toLowerCase().includes(lowerTerm) ||
      c.phoneNumber.includes(lowerTerm) ||
      (c.description && c.description.toLowerCase().includes(lowerTerm))
    );
  }
}
