import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  private returnUrl: string = '/people';

  ngOnInit(): void {
    // Get return url from route parameters or default to '/people'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/people';
  }

  onLogin(credentials: LoginCredentials): void {
    this.errorMessage.set('');

    if (!credentials.username || !credentials.password) {
      this.errorMessage.set('لطفاً نام کاربری و رمز عبور را وارد کنید.');
      return;
    }

    this.isLoading.set(true);

    this.authService.login(credentials.username, credentials.password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.alertService.showSuccess(`خوش آمدید ${response.data.fullName}`);
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'نام کاربری یا رمز عبور اشتباه است.');
      }
    });
  }
}
