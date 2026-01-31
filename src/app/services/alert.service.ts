import { Injectable, signal } from '@angular/core';

export interface AlertConfig {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSignal = signal<AlertConfig | null>(null);
  alert = this.alertSignal.asReadonly();

  show(config: AlertConfig): void {
    this.alertSignal.set(config);
    
    const duration = config.duration || 2000;
    setTimeout(() => {
      this.alertSignal.set(null);
    }, duration);
  }

  showSuccess(message: string, duration?: number): void {
    this.show({ message, type: 'success', duration });
  }

  showError(message: string, duration?: number): void {
    this.show({ message, type: 'error', duration });
  }

  showInfo(message: string, duration?: number): void {
    this.show({ message, type: 'info', duration });
  }

  hide(): void {
    this.alertSignal.set(null);
  }
}
