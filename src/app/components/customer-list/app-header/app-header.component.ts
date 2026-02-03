import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { IconComponent } from '../../ui/icon/icon.component';
import { UserInfo } from '../../../models/auth.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './app-header.component.html',
  styles: []
})
export class AppHeaderComponent {
  currentUser = input<UserInfo | null>(null);
  onLogout = output<void>();

  handleLogout(): void {
    this.onLogout.emit();
  }
}
