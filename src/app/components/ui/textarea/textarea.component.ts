import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  imports: [CommonModule, FormsModule],
  templateUrl: './textarea.component.html',
  styles: []
})
export class TextareaComponent {
  id = input<string>('');
  label = input<string>('');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  rows = input<number>(3);
  value = input<string>('');
  
  valueChange = output<string>();

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.valueChange.emit(target.value);
  }

  getTextareaClasses(): string {
    return 'flex min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  }
}
