import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/40"></div>
        
        <!-- Dialog Content -->
        <div class="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10 animate-in fade-in duration-200">
          <p class="text-center text-gray-900 mb-6">{{ message() }}</p>
          
          <div class="flex gap-3 justify-center">
            <app-button 
              [variant]="'outline'"
              (clicked)="onNo()"
              class="flex-1"
            >
              خیر
            </app-button>
            <app-button 
              [variant]="'default'"
              (clicked)="onYes()"
              class="flex-1"
            >
              بله
            </app-button>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class ConfirmDialogComponent {
  isOpen = input<boolean>(false);
  message = input<string>('');
  
  confirmed = output<boolean>();

  onYes(): void {
    this.confirmed.emit(true);
  }

  onNo(): void {
    this.confirmed.emit(false);
  }
}
