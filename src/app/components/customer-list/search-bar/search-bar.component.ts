import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, IconComponent],
  templateUrl: './search-bar.component.html',
  styles: []
})
export class SearchBarComponent {
  value = input<string>('');
  placeholder = input<string>('جستجو...');
  onChange = output<string>();

  handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.onChange.emit(target.value);
  }
}
