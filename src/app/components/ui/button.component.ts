import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="getButtonClasses()"
      (click)="handleClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  type = input<'button' | 'submit'>('button');
  variant = input<'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'>('default');
  size = input<'default' | 'sm' | 'lg' | 'icon'>('default');
  disabled = input<boolean>(false);
  fullWidth = input<boolean>(false);
  
  clicked = output<Event>();

  handleClick(event: Event): void {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }

  getButtonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variantClasses = {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
      outline: 'border border-gray-300 bg-white hover:bg-gray-100 text-gray-900',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700',
      ghost: 'hover:bg-gray-100 text-gray-900',
      link: 'text-blue-600 underline-offset-4 hover:underline'
    };
    
    const sizeClasses = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10'
    };
    
    const widthClass = this.fullWidth() ? 'w-full' : '';
    
    return `${baseClasses} ${variantClasses[this.variant()]} ${sizeClasses[this.size()]} ${widthClass}`;
  }
}
