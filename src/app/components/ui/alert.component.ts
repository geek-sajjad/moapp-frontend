import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  template: `
    @if (alertService.alert(); as alert) {
      <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top duration-300">
        <div 
          [class]="getAlertClasses(alert.type || 'info')"
          class="px-6 py-3 rounded-lg shadow-lg"
        >
          <p class="text-sm font-medium">{{ alert.message }}</p>
        </div>
      </div>
    }
  `,
  styles: []
})
export class AlertComponent {
  alertService = inject(AlertService);

  getAlertClasses(type: string): string {
    const baseClasses = 'text-white';
    
    const typeClasses = {
      success: 'bg-green-600',
      error: 'bg-red-600',
      info: 'bg-blue-600',
      warning: 'bg-yellow-600'
    };
    
    return `${baseClasses} ${typeClasses[type as keyof typeof typeClasses] || typeClasses.info}`;
  }
}
