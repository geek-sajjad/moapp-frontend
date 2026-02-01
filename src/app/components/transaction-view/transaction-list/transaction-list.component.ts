import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../models/transaction.model';
import { IconComponent } from '../../ui/icon/icon.component';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule, IconComponent, TransactionItemComponent],
  templateUrl: './transaction-list.component.html',
  styles: []
})
export class TransactionListComponent {
  transactions = input.required<Transaction[]>();
}
