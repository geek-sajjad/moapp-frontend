import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '../../../models/person.model';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-customer-card',
  imports: [CommonModule, IconComponent],
  templateUrl: './customer-card.component.html',
  styles: []
})
export class CustomerCardComponent {
  customer = input.required<Person>();
  onClick = output<Person>();

  handleClick(): void {
    this.onClick.emit(this.customer());
  }
}
