import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full">
      @if (label()) {
        <label [for]="id()" class="block text-sm font-medium text-gray-700 mb-1">
          {{ label() }}
        </label>
      }
      <input
        [id]="id()"
        [type]="type()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [value]="value()"
        (input)="onInput($event)"
        [class]="getInputClasses()"
      />
    </div>
  `,
  styles: []
})
export class InputComponent {
  id = input<string>('');
  type = input<string>('text');
  label = input<string>('');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  value = input<string>('');
  error = input<string>('');
  
  valueChange = output<string>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }

  getInputClasses(): string {
    const baseClasses = 'flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    const errorClasses = this.error() ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-blue-600';
    
    return `${baseClasses} ${errorClasses}`;
  }
}
