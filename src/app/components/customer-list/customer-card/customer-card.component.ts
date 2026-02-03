import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../../../models/customer.model';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-customer-card',
  imports: [CommonModule, IconComponent],
  templateUrl: './customer-card.component.html',
  styles: []
})
export class CustomerCardComponent {
  customer = input.required<Customer>();
  onClick = output<Customer>();
  onEdit = output<Customer>();

  handleClick(): void {
    this.onClick.emit(this.customer());
  }

  handleEdit(event: Event): void {
    event.stopPropagation();
    this.onEdit.emit(this.customer());
  }
}
