import { Component, input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../models/transaction.model';
import { IconComponent } from '../../ui/icon/icon.component';
import { DateUtilService } from '../../../services/date-util.service';
import { PersianCalendarService } from '../../../services/persian-calendar.service';

@Component({
  selector: 'app-transaction-item',
  imports: [CommonModule, IconComponent],
  templateUrl: './transaction-item.component.html',
  styles: []
})
export class TransactionItemComponent {
  constructor(private pCalanderService:PersianCalendarService) {
    
  }

  private dateUtil = inject(DateUtilService);

  transaction = input.required<Transaction>();

  formatNumber(num: number): string {
    return this.dateUtil.formatNumber(num);
  }

  transactionDate = computed(() => {
    const date = this.transaction().date;
    return date ? this.pCalanderService.formatDisplayValue(String(date)) : '';
  });
}
