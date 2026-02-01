import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { IconComponent } from '../../ui/icon/icon.component';

export interface TransactionFormData {
  date: string;
  type: 'debit' | 'credit';
  amount: string;
  description: string;
}

@Component({
  selector: 'app-transaction-form',
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './transaction-form.component.html',
  styles: []
})
export class TransactionFormComponent {
  isEditing = input<boolean>(false);
  initialData = input<TransactionFormData | null>(null);
  
  onSave = output<TransactionFormData>();
  onCancel = output<void>();

  formDate = signal<string>('');
  formType = signal<'debit' | 'credit'>('debit');
  formAmount = signal<string>('');
  formDescription = signal<string>('');

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.formDate.set(data.date);
        this.formType.set(data.type);
        this.formAmount.set(data.amount);
        this.formDescription.set(data.description);
      }
    });
  }

  handleSave(): void {
    this.onSave.emit({
      date: this.formDate(),
      type: this.formType(),
      amount: this.formAmount(),
      description: this.formDescription()
    });
  }

  handleCancel(): void {
    this.onCancel.emit();
  }

  getTransactionTypeClass(): string {
    return this.formType() === 'debit' 
      ? 'border-red-500 bg-red-50 text-red-700'
      : 'border-green-500 bg-green-50 text-green-700';
  }
}
