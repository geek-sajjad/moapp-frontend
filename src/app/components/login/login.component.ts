import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { IconComponent } from '../ui/icon/icon.component';
import { LoginFormComponent, LoginCredentials } from './login-form/login-form.component';

@Component({
  selector: 'app-login',
  imports: [IconComponent, LoginFormComponent],
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  errorMessage = signal<string>('');

  onLogin(credentials: LoginCredentials): void {
    this.errorMessage.set('');

    if (!credentials.username || !credentials.password) {
      this.errorMessage.set('لطفاً نام کاربری و رمز عبور را وارد کنید.');
      return;
    }

    const success = this.authService.login(credentials.username, credentials.password);

    if (success) {
      this.alertService.showSuccess('ورود با موفقیت انجام شد');
      this.router.navigate(['/people']);
    } else {
      this.errorMessage.set('نام کاربری یا رمز عبور اشتباه است.');
    }
  }
}
