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
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 px-4 py-8">
      <div class="w-full max-w-md animate-in fade-in zoom-in slide-in-from-bottom duration-500">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-foreground mb-2">
            دفتر معین شخصی
          </h1>
          <p class="text-muted-foreground text-sm">
            مدیریت حساب‌های شخصی و تراکنش‌ها
          </p>
        </div>

        <!-- Login Card -->
        <div class="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
          <!-- Card Header -->
          <div class="px-6 py-5 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
            <h2 class="text-xl font-bold text-center text-foreground">
              ورود به سیستم
            </h2>
          </div>
          
          <!-- Card Content -->
          <form (ngSubmit)="onLogin()" class="p-6 space-y-5">
            <div class="space-y-2">
              <label for="username" class="block text-sm font-semibold text-foreground">
                نام کاربری
              </label>
              <div class="relative">
                <div class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  [(ngModel)]="username"
                  name="username"
                  placeholder="نام کاربری خود را وارد کنید"
                  class="w-full h-11 pr-11 pl-3 py-2 border-2 border-input bg-background rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:border-ring/50 placeholder:text-muted-foreground"
                />
              </div>
            </div>
            
            <div class="space-y-2">
              <label for="password" class="block text-sm font-semibold text-foreground">
                رمز عبور
              </label>
              <div class="relative">
                <div class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="رمز عبور خود را وارد کنید"
                  class="w-full h-11 pr-11 pl-3 py-2 border-2 border-input bg-background rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:border-ring/50 placeholder:text-muted-foreground"
                />
              </div>
            </div>
            
            @if (errorMessage()) {
              <div class="bg-destructive/10 border-2 border-destructive/20 text-destructive rounded-lg p-3 animate-in fade-in slide-in-from-top duration-200">
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                  <span class="text-sm font-medium">{{ errorMessage() }}</span>
                </div>
              </div>
            }
            
            <app-button 
              type="submit" 
              [fullWidth]="true"
              [size]="'lg'"
              class="mt-6"
            >
              ورود به حساب کاربری
            </app-button>
          </form>
          
          <!-- Card Footer -->
          <div class="px-6 py-4 bg-muted/30 border-t border-border">
            <div class="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>نام کاربری و رمز عبور: <strong class="text-foreground">admin / admin</strong></span>
            </div>
          </div>
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
