import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full space-y-2">
      @if (label()) {
        <label [for]="id()" class="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
      @if (error()) {
        <p class="text-sm font-medium text-destructive animate-in fade-in slide-in-from-top duration-200">
          {{ error() }}
        </p>
      }
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
    const baseClasses = 'flex h-11 w-full rounded-lg border-2 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    const errorClasses = this.error() ? 'border-destructive focus-visible:ring-destructive' : 'border-input hover:border-ring/50';
    
    return `${baseClasses} ${errorClasses}`;
  }
}
