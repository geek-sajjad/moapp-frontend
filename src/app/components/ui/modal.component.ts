import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          (click)="onClose()"
        ></div>
        
        <!-- Modal Content -->
        <div class="relative bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 z-10 animate-in fade-in zoom-in slide-in-from-bottom duration-300 border border-border">
          <!-- Close Button -->
          @if (showClose()) {
            <button
              (click)="onClose()"
              class="absolute left-4 top-4 rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          }
          
          <!-- Title -->
          @if (title()) {
            <div class="border-b border-border px-6 py-4">
              <h2 class="text-xl font-bold text-foreground">
                {{ title() }}
              </h2>
            </div>
          }
          
          <!-- Content -->
          <div class="p-6">
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
