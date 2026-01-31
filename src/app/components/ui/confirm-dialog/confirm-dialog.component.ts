import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './confirm-dialog.component.html',
  styles: [],
})
export class ConfirmDialogComponent {
  isOpen = input<boolean>(false);
  message = input<string>('');

  confirmed = output<boolean>();

  onYes(): void {
    this.confirmed.emit(true);
  }

  onNo(): void {
    this.confirmed.emit(false);
  }
}
