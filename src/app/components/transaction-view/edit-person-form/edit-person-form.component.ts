import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { IconComponent, IconName } from '../../ui/icon/icon.component';

export interface PersonFormData {
  name: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-edit-person-form',
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './edit-person-form.component.html',
  styles: []
})
export class EditPersonFormComponent {
  initialData = input<PersonFormData | null>(null);
  buttonText = input<string>('ذخیره تغییرات');
  buttonIcon = input<IconName>('save');
  onSave = output<PersonFormData>();

  formName = signal<string>('');
  formPhone = signal<string>('');
  formAddress = signal<string>('');

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.formName.set(data.name);
        this.formPhone.set(data.phone);
        this.formAddress.set(data.address);
      }
    });
  }

  handleSave(): void {
    this.onSave.emit({
      name: this.formName(),
      phone: this.formPhone(),
      address: this.formAddress()
    });
  }
}
