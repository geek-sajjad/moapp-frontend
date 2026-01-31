import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styles: [],
})
export class ModalComponent {
  isOpen = input<boolean>(false);
  title = input<string>('');
  showClose = input<boolean>(true);

  closed = output<void>();

  onClose(): void {
    this.closed.emit();
  }
}
