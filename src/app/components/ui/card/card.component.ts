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
      default: 'bg-card border border-border shadow-md hover:shadow-lg',
      elevated: 'bg-card shadow-xl border border-border hover:shadow-2xl',
      outline: 'bg-card border-2 border-border hover:border-primary/30',
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
