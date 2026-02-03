import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle.component.html',
  styles: []
})
export class ToggleComponent {
  checked = input<boolean>(false);
  disabled = input<boolean>(false);
  label = input<string>('');
  onChange = output<boolean>();

  internalChecked = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.internalChecked.set(this.checked());
    });
  }

  handleToggle(): void {
    if (this.disabled()) return;
    
    const newValue = !this.internalChecked();
    this.internalChecked.set(newValue);
    this.onChange.emit(newValue);
  }
}
