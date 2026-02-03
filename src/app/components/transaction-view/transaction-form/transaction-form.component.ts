import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { IconComponent } from '../../ui/icon/icon.component';
import { PersianDatepickerComponent } from '../../ui/persian-datepicker/persian-datepicker.component';
import { TransactionFormData } from '../../../models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  imports: [CommonModule, ButtonComponent, IconComponent, PersianDatepickerComponent],
  templateUrl: './transaction-form.component.html',
  styles: []
})
export class TransactionFormComponent {
  isEditing = input<boolean>(false);
  initialData = input<TransactionFormData | null>(null);
  
  onSave = output<TransactionFormData>();
  onCancel = output<void>();

  formDate = signal<string>('');
  formType = signal<'DEBIT' | 'CREDIT'>('CREDIT');
  formAmount = signal<string>('');
  formDescription = signal<string>('');

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.formDate.set(data.transactionDate);
        this.formType.set(data.type);
        this.formAmount.set(data.amount);
        this.formDescription.set(data.description);
      }
    });
  }

  handleSave(): void {
    console.log(this.formDate());
    this.onSave.emit({
      transactionDate: this.formDate(),
      type: this.formType(),
      amount: this.formAmount(),
      description: this.formDescription()
    });
  }

  handleCancel(): void {
    this.onCancel.emit();
  }

  getTransactionTypeClass(): string {
    return this.formType() === 'DEBIT' 
      ? 'border-red-500 bg-red-50 text-red-700'
      : 'border-green-500 bg-green-50 text-green-700';
  }

  getFormattedAmount(): string {
    const amount = this.formAmount();
    if (!amount) return '';
    // Format number with thousand separators
    return Number(amount).toLocaleString('en-US');
  }

  handleAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');
    // Update the signal with the raw numeric value
    this.formAmount.set(numericValue);
  }
}
