import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styles: [
    `
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      .skeleton-shimmer {
        background: linear-gradient(
          90deg,
          hsl(var(--muted)) 0%,
          hsl(var(--muted) / 0.5) 50%,
          hsl(var(--muted)) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s ease-in-out infinite;
      }
    `,
  ],
})
export class SkeletonComponent {
  variant = input<'default' | 'circular' | 'text'>('default');
  width = input<string>('100%');
  height = input<string>('1rem');
  className = input<string>('');

  getSkeletonClasses(): string {
    const baseClasses = 'skeleton-shimmer bg-muted';

    const variantClasses = {
      default: 'rounded-lg',
      circular: 'rounded-full',
      text: 'rounded h-4',
    };

    return `${baseClasses} ${variantClasses[this.variant()]} ${this.className()}`;
  }
}
