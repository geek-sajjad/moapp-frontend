import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full">
      @if (label()) {
        <label [for]="id()" class="block text-sm font-medium text-gray-700 mb-1">
          {{ label() }}
        </label>
      }
      <select
        [id]="id()"
        [disabled]="disabled()"
        [value]="value()"
        (change)="onChange($event)"
        [class]="getSelectClasses()"
      >
        <ng-content></ng-content>
      </select>
    </div>
  `,
  styles: []
})
export class SelectComponent {
  id = input<string>('');
  label = input<string>('');
  disabled = input<boolean>(false);
  value = input<string>('');
  
  valueChange = output<string>();

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.valueChange.emit(target.value);
  }

  getSelectClasses(): string {
    return 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  }
}
