import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
        
        <!-- Dialog Content -->
        <div class="relative bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 z-10 animate-in fade-in zoom-in slide-in-from-bottom duration-300 border border-border">
          <!-- Icon -->
          <div class="flex justify-center pt-6">
            <div class="rounded-full bg-destructive/10 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-destructive">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
          </div>
          
          <!-- Message -->
          <div class="px-6 py-4">
            <p class="text-center text-foreground font-medium text-base">{{ message() }}</p>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-3 px-6 pb-6">
            <app-button 
              [variant]="'outline'"
              (clicked)="onNo()"
              class="flex-1"
            >
              خیر
            </app-button>
            <app-button 
              [variant]="'destructive'"
              (clicked)="onYes()"
              class="flex-1"
            >
              بله، حذف شود
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
