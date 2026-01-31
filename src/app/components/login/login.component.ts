import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { ButtonComponent } from '../ui/button.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ButtonComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-2xl font-bold text-center text-blue-700 mb-6">
          ورود به سیستم
        </h1>
        
        <hr class="mb-6 border-gray-200">
        
        <form (ngSubmit)="onLogin()" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
              نام کاربری:
            </label>
            <input
              type="text"
              id="username"
              [(ngModel)]="username"
              name="username"
              placeholder="نام کاربری خود را وارد کنید"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              رمز عبور:
            </label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              placeholder="رمز عبور خود را وارد کنید"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          
          <app-button 
            type="submit" 
            [fullWidth]="true"
            class="mt-4"
          >
            ورود
          </app-button>
          
          @if (errorMessage()) {
            <div class="text-red-600 text-center text-sm mt-2">
              {{ errorMessage() }}
            </div>
          }
        </form>
        
        <div class="mt-6 text-center text-sm text-gray-600">
          <p>نام کاربری و رمز عبور پیش‌فرض: admin / admin</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  username = '';
  password = '';
  errorMessage = signal<string>('');

  onLogin(): void {
    this.errorMessage.set('');
    
    if (!this.username || !this.password) {
      this.errorMessage.set('لطفاً نام کاربری و رمز عبور را وارد کنید.');
      return;
    }

    const success = this.authService.login(this.username, this.password);
    
    if (success) {
      this.alertService.showSuccess('ورود با موفقیت انجام شد');
      this.router.navigate(['/people']);
    } else {
      this.errorMessage.set('نام کاربری یا رمز عبور اشتباه است.');
    }
  }
}
