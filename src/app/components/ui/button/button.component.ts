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
      'inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-xl font-bold ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] touch-manipulation';

    const variantClasses = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg',
      destructive:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg',
      outline:
        'border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 text-gray-900 shadow-sm hover:shadow-md',
      secondary:
        'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 shadow-sm hover:shadow-md',
      ghost: 'hover:bg-gray-100 active:bg-gray-200 text-gray-900',
      link: 'text-blue-600 underline-offset-4 hover:underline active:text-blue-800',
    };

    const sizeClasses = {
      default: 'min-h-[44px] px-5 py-3 text-sm',
      sm: 'min-h-[40px] px-4 py-2.5 text-sm',
      lg: 'min-h-[48px] px-6 py-3.5 text-base',
      icon: 'min-h-[44px] min-w-[44px] w-11 h-11',
    };

    const widthClass = this.fullWidth() ? 'w-full' : '';

    return `${baseClasses} ${variantClasses[this.variant()]} ${sizeClasses[this.size()]} ${widthClass}`;
  }
}
