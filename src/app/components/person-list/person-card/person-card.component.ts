import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '../../../models/person.model';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-person-card',
  imports: [CommonModule, IconComponent],
  templateUrl: './person-card.component.html',
  styles: []
})
export class PersonCardComponent {
  person = input.required<Person>();
  onClick = output<Person>();

  handleClick(): void {
    this.onClick.emit(this.person());
  }
}
