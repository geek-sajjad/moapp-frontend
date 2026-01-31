import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../services/person.service';
import { TransactionService } from '../../services/transaction.service';
import { AlertService } from '../../services/alert.service';
import { ExportService } from '../../services/export.service';
import { DateUtilService } from '../../services/date-util.service';
import { Person } from '../../models/person.model';
import { Transaction, CreateTransactionDto } from '../../models/transaction.model';
import { ButtonComponent } from '../ui/button.component';
import { ModalComponent } from '../ui/modal.component';
import { ConfirmDialogComponent } from '../ui/confirm-dialog.component';

@Component({
  selector: 'app-transaction-view',
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    ModalComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './transaction-view.component.html',
  styles: []
})
export class TransactionViewComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private personService = inject(PersonService);
  private transactionService = inject(TransactionService);
  private alertService = inject(AlertService);
  private exportService = inject(ExportService);
  private dateUtil = inject(DateUtilService);

  personId = signal<string>('');
  currentPerson = signal<Person | undefined>(undefined);
  transactions = signal<Transaction[]>([]);
  
  balance = computed(() => {
    return this.transactions().reduce((total, t) => {
      return total + (t.type === 'debit' ? -t.amount : t.amount);
    }, 0);
  });

  // Transaction Form
  transactionDate = signal<string>('');
  transactionType = signal<'debit' | 'credit'>('debit');
  transactionAmount = signal<string>('');
  transactionDescription = signal<string>('');
  editingTransactionId = signal<string>('');
  isEditing = computed(() => !!this.editingTransactionId());

  // Edit Person Modal
  showEditPersonModal = signal<boolean>(false);
  editPersonName = signal<string>('');
  editPersonPhone = signal<string>('');
  editPersonAddress = signal<string>('');

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
        this.transactionDate.set(this.dateUtil.getCurrentPersianDate());
      }
    });
  }

  loadPersonData(id: string): void {
    const person = this.personService.getPersonById(id);
    this.currentPerson.set(person);
  }

  loadTransactions(personId: string): void {
    const trans = this.transactionService.getTransactionsByPersonId(personId);
    this.transactions.set(trans);
  }

  saveTransaction(): void {
    const amount = parseFloat(this.transactionAmount());
    
    if (isNaN(amount) || amount <= 0) {
      this.alertService.showError('لطفاً مبلغ را به درستی وارد کنید.');
      return;
    }

    const dto: CreateTransactionDto = {
      personId: this.personId(),
      date: this.transactionDate(),
      type: this.transactionType(),
      amount: amount,
      description: this.transactionDescription()
    };

    if (this.isEditing()) {
      const result = this.transactionService.updateTransaction(this.editingTransactionId(), dto);
      if (result) {
        this.alertService.showSuccess('تراکنش با موفقیت به‌روزرسانی شد.');
      } else {
        this.alertService.showError('خطا در به‌روزرسانی تراکنش.');
      }
    } else {
      this.transactionService.addTransaction(dto);
      this.alertService.showSuccess('تراکنش با موفقیت ثبت شد.');
    }

    this.clearTransactionForm();
    this.loadTransactions(this.personId());
  }

  editTransaction(transaction: Transaction): void {
    this.editingTransactionId.set(transaction.id);
    this.transactionDate.set(transaction.date);
    this.transactionType.set(transaction.type);
    this.transactionAmount.set(transaction.amount.toString());
    this.transactionDescription.set(transaction.description);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  confirmDeleteTransaction(transactionId: string): void {
    this.confirmMessage.set('آیا از حذف این تراکنش مطمئن هستید؟');
    this.confirmCallback.set(() => this.deleteTransaction(transactionId));
    this.showConfirmDialog.set(true);
  }

  deleteTransaction(transactionId: string): void {
    const success = this.transactionService.deleteTransaction(transactionId);
    
    if (success) {
      this.alertService.showSuccess('تراکنش با موفقیت حذف شد.');
      this.loadTransactions(this.personId());
    } else {
      this.alertService.showError('خطا در حذف تراکنش.');
    }
  }

  clearTransactionForm(): void {
    this.editingTransactionId.set('');
    this.transactionDate.set(this.dateUtil.getCurrentPersianDate());
    this.transactionType.set('debit');
    this.transactionAmount.set('');
    this.transactionDescription.set('');
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
      this.editPersonName.set(person.name);
      this.editPersonPhone.set(person.phone || '');
      this.editPersonAddress.set(person.address || '');
      this.showEditPersonModal.set(true);
    }
  }

  closeEditPersonModal(): void {
    this.showEditPersonModal.set(false);
  }

  saveEditedPerson(): void {
    const name = this.editPersonName();
    
    if (!name.trim()) {
      this.alertService.showError('لطفاً نام شخص را وارد کنید.');
      return;
    }

    const result = this.personService.updatePerson(this.personId(), {
      name: name.trim(),
      phone: this.editPersonPhone().trim(),
      address: this.editPersonAddress().trim()
    });

    if (result) {
      this.alertService.showSuccess('مشخصات شخص با موفقیت به‌روزرسانی شد.');
      this.loadPersonData(this.personId());
      this.closeEditPersonModal();
    } else {
      this.alertService.showError('خطا در به‌روزرسانی شخص.');
    }
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

  formatNumber(num: number): string {
    return this.dateUtil.formatNumber(num);
  }

  goBack(): void {
    this.router.navigate(['/people']);
  }

  getTransactionTypeClass(): string {
    return this.transactionType() === 'debit' 
      ? 'border-red-500 bg-red-50 text-red-700'
      : 'border-green-500 bg-green-50 text-green-700';
  }
}
