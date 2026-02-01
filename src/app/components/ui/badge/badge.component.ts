import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styles: [],
})
export class BadgeComponent {
  variant = input<'default' | 'success' | 'error' | 'warning' | 'info' | 'outline'>('default');
  size = input<'sm' | 'default' | 'lg'>('default');
  className = input<string>('');

  getBadgeClasses(): string {
    const baseClasses = 'inline-flex items-center font-semibold rounded-full transition-colors';

    const variantClasses = {
      default: 'bg-blue-600 text-white',
      success: 'bg-green-100 text-green-800 border border-green-200',
      error: 'bg-red-100 text-red-800 border border-red-200',
      warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      info: 'bg-blue-100 text-blue-800 border border-blue-200',
      outline: 'border-2 border-gray-300 bg-white text-gray-900',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      default: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    };

    return `${baseClasses} ${variantClasses[this.variant()]} ${sizeClasses[this.size()]} ${this.className()}`;
  }
}
