import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  template: `
    <div [class]="getCardClasses()">
      @if (showHeader()) {
        <div class="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
          <ng-content select="[card-header]"></ng-content>
        </div>
      }
      
      <div [class]="getContentClasses()">
        <ng-content></ng-content>
      </div>
      
      @if (showFooter()) {
        <div class="px-6 py-4 border-t border-border bg-muted/20">
          <ng-content select="[card-footer]"></ng-content>
        </div>
      }
    </div>
  `,
  styles: []
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
      outline: 'bg-card border-2 border-border hover:border-primary/30'
    };
    
    return `${baseClasses} ${variantClasses[this.variant()]} ${this.className()}`;
  }

  getContentClasses(): string {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      default: 'p-6',
      lg: 'p-8'
    };
    
    return paddingClasses[this.padding()];
  }
}
