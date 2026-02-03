import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../services/person.service';
import { CustomerService } from '../../services/customer.service';
import { TransactionService } from '../../services/transaction.service';
import { AlertService } from '../../services/alert.service';
import { ExportService } from '../../services/export.service';
import { DateUtilService } from '../../services/date-util.service';
import { Person } from '../../models/person.model';
import { UpdateCustomerDto } from '../../models/customer.model';
import { Transaction, CreateTransactionDto, TransactionFormData, TransactionSummary } from '../../models/transaction.model';
import { ButtonComponent } from '../ui/button/button.component';
import { ModalComponent } from '../ui/modal/modal.component';
import { ConfirmDialogComponent } from '../ui/confirm-dialog/confirm-dialog.component';
import { IconComponent } from '../ui/icon/icon.component';
import { PersonInfoCardComponent } from './person-info-card/person-info-card.component';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { EditPersonFormComponent, PersonFormData } from './edit-person-form/edit-person-form.component';
import { delay } from 'rxjs';

@Component({
  selector: 'app-transaction-view',
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    ModalComponent,
    ConfirmDialogComponent,
    IconComponent,
    PersonInfoCardComponent,
    TransactionFormComponent,
    TransactionListComponent,
    EditPersonFormComponent
  ],
  templateUrl: './transaction-view.component.html',
  styles: []
})
export class TransactionViewComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private personService = inject(PersonService);
  private customerService = inject(CustomerService);
  private transactionService = inject(TransactionService);
  private alertService = inject(AlertService);
  private exportService = inject(ExportService);
  private dateUtil = inject(DateUtilService);

  personId = signal<string>('');
  currentPerson = signal<Person | undefined>(undefined);
  transactions = signal<Transaction[]>([]);
  transactionSummray = signal<TransactionSummary | null>(null)
  transactionsLoading = signal<boolean>(false);

  balance = computed(() => {
    const list = this.transactions() ?? [];
    return list.reduce((total, t) => {
      return total + (t.type === 'DEBIT' ? -t.amount : t.amount);
    }, 0);
  });

  // Transaction Form
  transactionFormData = signal<TransactionFormData | null>(null);
  editingTransactionId = signal<string>('');
  isEditing = computed(() => !!this.editingTransactionId());

  // Edit Person Modal
  showEditPersonModal = signal<boolean>(false);
  editPersonData = signal<PersonFormData>({
    name: '',
    phone: '',
    address: ''
  });

  // Confirm Dialog
  showConfirmDialog = signal<boolean>(false);
  confirmMessage = signal<string>('');
  confirmCallback = signal<(() => void) | null>(null);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.personId.set(id);
        this.loadPersonData(id);
        this.loadTransactions(id);
        this.loadTransactionSummra(id);
        this.transactionFormData.set({
          transactionDate: this.dateUtil.getCurrentPersianDate(),
          type: 'CREDIT',
          amount: '',
          description: ''
        });
      }
    });
  }

  loadPersonData(id: string): void {
    // Try to get from CustomerService API first
    this.customerService.getCustomerById(id).subscribe({
      next: (customer) => {
        // Map Customer to Person format for compatibility
        const person: Person = {
          id: customer.id,
          name: customer.name,
          phone: customer.phoneNumber || undefined,
          address: customer.description || undefined,
          createdAt: new Date(customer.createdAt)
        };
        this.currentPerson.set(person);
      },
      error: (error) => {
        console.error('Error loading customer:', error);
        // Fallback to local PersonService
        const person = this.personService.getPersonById(id);
        this.currentPerson.set(person);
      }
    });
  }

  loadTransactions(customerId: string): void {
    this.transactionsLoading.set(true);
    this.transactionService.getCustomerTransactions(customerId).subscribe({
      next: (transactions) => {
        this.transactions.set(transactions);
        this.transactionsLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.transactions.set([]);
        this.transactionsLoading.set(false);
        this.alertService.showError('خطا در بارگذاری تراکنش‌ها.');
      }
    });
  }

  loadTransactionSummra(customerId: string) {
    this.transactionService.getTransactionSummary(customerId).subscribe({
      next: (tSummray) => {
        console.log("got the summary in service level", tSummray)
        this.transactionSummray.set(tSummray);
        this.transactionsLoading.set(false);
      },
      error: (error)=> {
        console.error('Error loading transactions:', error);
        this.transactionSummray.set(null);
        this.transactionsLoading.set(false);
        this.alertService.showError('خطا در بارگذاری خلاصه تراکنش ها.');

      }
    });
  }

  saveTransaction(formData: TransactionFormData): void {
    const amount = parseFloat(formData.amount);
    
    if (isNaN(amount) || amount <= 0) {
      this.alertService.showError('لطفاً مبلغ را به درستی وارد کنید.');
      return;
    }

    const dto: CreateTransactionDto = {
      customerId: this.personId(),
      date: formData.transactionDate,
      type: formData.type,
      amount: amount,
      description: formData.description
    };

    // For now, we only support creating transactions (backend doesn't have update endpoint)
    this.transactionService.createTransaction(dto).subscribe({
      next: () => {
        this.alertService.showSuccess('تراکنش با موفقیت ثبت شد.');
        this.clearTransactionForm();
        this.loadTransactions(this.personId());
        this.loadTransactionSummra(this.personId());
      },
      error: (error) => {
        console.error('Error creating transaction:', error);
        this.alertService.showError('خطا در ثبت تراکنش.');
      }
    });
  }

  // editTransaction(transaction: Transaction): void {
  //   this.editingTransactionId.set(transaction.id);
  //   this.transactionDate.set(transaction.date);
  //   this.transactionType.set(transaction.type);
  //   this.transactionAmount.set(transaction.amount.toString());
  //   this.transactionDescription.set(transaction.description);
    
  //   // Scroll to form
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // }

  // confirmDeleteTransaction(transactionId: string): void {
  //   this.confirmMessage.set('آیا از حذف این تراکنش مطمئن هستید؟');
  //   this.confirmCallback.set(() => this.deleteTransaction(transactionId));
  //   this.showConfirmDialog.set(true);
  // }

  deleteTransaction(transactionId: string): void {
    // Note: Backend doesn't have delete transaction endpoint yet
    // This is a placeholder for future implementation
    this.alertService.showError('حذف تراکنش در حال حاضر پشتیبانی نمی‌شود.');
  }

  clearTransactionForm(): void {
    this.editingTransactionId.set('');
    this.transactionFormData.set({
      transactionDate: this.dateUtil.getCurrentPersianDate(),
      type: 'DEBIT',
      amount: '',
      description: ''
    });
  }

  onConfirm(confirmed: boolean): void {
    this.showConfirmDialog.set(false);
    
    if (confirmed && this.confirmCallback()) {
      this.confirmCallback()!();
    }
    
    this.confirmCallback.set(null);
  }

  openEditPersonModal(): void {
    const person = this.currentPerson();
    if (person) {
      this.editPersonData.set({
        name: person.name,
        phone: person.phone || '',
        address: person.address || ''
      });
      this.showEditPersonModal.set(true);
    }
  }

  closeEditPersonModal(): void {
    this.showEditPersonModal.set(false);
  }

  saveEditedPerson(formData: PersonFormData): void {
    if (!formData.name.trim()) {
      this.alertService.showError('لطفاً نام مشتری را وارد کنید.');
      return;
    }

    // Map PersonFormData to UpdateCustomerDto
    const dto: UpdateCustomerDto = {
      name: formData.name.trim(),
      phoneNumber: formData.phone.trim() || undefined,
      description: formData.address.trim() || undefined
    };

    // Use CustomerService API to update
    this.customerService.updateCustomer(this.personId(), dto).subscribe({
      next: () => {
        this.alertService.showSuccess('مشخصات مشتری با موفقیت به‌روزرسانی شد.');
        this.loadPersonData(this.personId());
        this.closeEditPersonModal();
      },
      error: (error) => {
        console.error('Error updating customer:', error);
        this.alertService.showError('خطا در به‌روزرسانی مشتری.');
      }
    });
  }

  shareStatement(): void {
    const person = this.currentPerson();
    if (!person || this.transactions().length === 0) {
      this.alertService.showError('تراکنشی برای ارسال وجود ندارد.');
      return;
    }

    this.exportService.shareStatement(person.name, this.transactions());
    this.alertService.showSuccess('متن صورت‌حساب کپی شد.');
  }

  goBack(): void {
    this.router.navigate(['/people']);
  }
}
