import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styles: [],
})
export class ButtonComponent {
  type = input<'button' | 'submit'>('button');
  variant = input<'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'>(
    'default',
  );
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
    const baseClasses =
      'inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95';

    const variantClasses = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md',
      destructive:
        'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md',
      outline:
        'border-2 border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900 shadow-sm hover:shadow',
      secondary:
        'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow',
      ghost: 'hover:bg-gray-100 hover:text-gray-900',
      link: 'text-blue-600 underline-offset-4 hover:underline',
    };

    const sizeClasses = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3 text-xs',
      lg: 'h-12 px-8 text-base',
      icon: 'h-10 w-10',
    };

    const widthClass = this.fullWidth() ? 'w-full' : '';

    return `${baseClasses} ${variantClasses[this.variant()]} ${sizeClasses[this.size()]} ${widthClass}`;
  }
}
