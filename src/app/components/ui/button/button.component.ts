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
      'inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95';

    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md',
      destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md',
      outline:
        'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
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
