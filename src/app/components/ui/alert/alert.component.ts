import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styles: [],
})
export class AlertComponent {
  alertService = inject(AlertService);

  getAlertClasses(type: string): string {
    const typeClasses = {
      success: 'bg-green-50 text-green-900 border-green-200',
      error: 'bg-red-50 text-red-900 border-red-200',
      info: 'bg-blue-50 text-blue-900 border-blue-200',
      warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    };

    return typeClasses[type as keyof typeof typeClasses] || typeClasses.info;
  }
}
