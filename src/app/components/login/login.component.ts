import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { ButtonComponent } from '../ui/button/button.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ButtonComponent],
  templateUrl: './login.component.html',
  styles: [],
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
