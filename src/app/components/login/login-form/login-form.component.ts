import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../ui/button/button.component';
import { IconComponent } from '../../ui/icon/icon.component';

export interface LoginCredentials {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, FormsModule, ButtonComponent, IconComponent],
  templateUrl: './login-form.component.html',
  styles: []
})
export class LoginFormComponent {
  errorMessage = input<string>('');
  onSubmit = output<LoginCredentials>();

  username = signal<string>('');
  password = signal<string>('');

  handleSubmit(): void {
    this.onSubmit.emit({
      username: this.username(),
      password: this.password()
    });
  }
}
