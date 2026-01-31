import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black/40"
          (click)="onClose()"
        ></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10 animate-in fade-in duration-200">
          <!-- Close Button -->
          @if (showClose()) {
            <button
              (click)="onClose()"
              class="absolute left-4 top-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          }
          
          <!-- Title -->
          @if (title()) {
            <h2 class="text-xl font-bold text-gray-900 mb-4 text-center">
              {{ title() }}
            </h2>
          }
          
          <!-- Content -->
          <div class="mt-2">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class ModalComponent {
  isOpen = input<boolean>(false);
  title = input<string>('');
  showClose = input<boolean>(true);
  
  closed = output<void>();

  onClose(): void {
    this.closed.emit();
  }
}
