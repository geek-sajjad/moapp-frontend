import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { IconComponent, IconName } from '../../ui/icon/icon.component';

export interface CustomerFormData {
  name: string;
  phoneNumber: string;
  description: string;
}

@Component({
  selector: 'app-customer-form',
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './customer-form.component.html',
  styles: []
})
export class CustomerFormComponent {
  initialData = input<CustomerFormData | null>(null);
  buttonText = input<string>('ذخیره تغییرات');
  buttonIcon = input<IconName>('save');
  onSave = output<CustomerFormData>();

  formName = signal<string>('');
  formPhoneNumber = signal<string>('');
  formDescription = signal<string>('');

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.formName.set(data.name);
        this.formPhoneNumber.set(data.phoneNumber);
        this.formDescription.set(data.description);
      }
    });
  }

  handleSave(): void {
    this.onSave.emit({
      name: this.formName(),
      phoneNumber: this.formPhoneNumber(),
      description: this.formDescription()
    });
  }
}
