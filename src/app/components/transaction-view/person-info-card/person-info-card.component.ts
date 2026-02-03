import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '../../../models/person.model';
import { ButtonComponent } from '../../ui/button/button.component';
import { IconComponent } from '../../ui/icon/icon.component';
import { DateUtilService } from '../../../services/date-util.service';
import { inject } from '@angular/core';
import { TransactionSummary } from '../../../models/transaction.model';

@Component({
  selector: 'app-person-info-card',
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './person-info-card.component.html',
  styles: [],
})
export class PersonInfoCardComponent {
  private dateUtil = inject(DateUtilService);

  person = input.required<Person>();
  // balance = input.required<number>();
  // balanceType = input.required<>();
  transactionSummray = input.required<TransactionSummary>();
  onEdit = output<void>();

  formatNumber(num: number): string {
    return this.dateUtil.formatNumber(num);
  }

  handleEdit(): void {
    this.onEdit.emit();
  }
}
