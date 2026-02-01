import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styles: [],
})
export class CardComponent {
  variant = input<'default' | 'elevated' | 'outline'>('default');
  padding = input<'none' | 'sm' | 'default' | 'lg'>('default');
  showHeader = input<boolean>(false);
  showFooter = input<boolean>(false);
  className = input<string>('');

  getCardClasses(): string {
    const baseClasses = 'rounded-2xl overflow-hidden transition-all duration-300';

    const variantClasses = {
      default: 'bg-white border border-gray-300 shadow-md hover:shadow-lg',
      elevated: 'bg-white shadow-xl border border-gray-300 hover:shadow-2xl',
      outline: 'bg-white border-2 border-gray-300 hover:border-blue-300',
    };

    return `${baseClasses} ${variantClasses[this.variant()]} ${this.className()}`;
  }

  getContentClasses(): string {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      default: 'p-6',
      lg: 'p-8',
    };

    return paddingClasses[this.padding()];
  }
}
