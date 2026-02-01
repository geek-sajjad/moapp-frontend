import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styles: [],
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
    const baseClasses =
      'flex min-h-[44px] w-full rounded-xl border-2 bg-white px-4 py-3 text-base font-medium ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 placeholder:font-normal transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation';
    const errorClasses = this.error()
      ? 'border-red-600 focus-visible:ring-red-600'
      : 'border-gray-300 hover:border-blue-400 focus:border-blue-500';

    return `${baseClasses} ${errorClasses}`;
  }
}
