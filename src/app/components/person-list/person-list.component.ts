import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { Person, CreatePersonDto } from '../../models/person.model';
import { ButtonComponent } from '../ui/button/button.component';
import { ModalComponent } from '../ui/modal/modal.component';
import { ConfirmDialogComponent } from '../ui/confirm-dialog/confirm-dialog.component';
import { IconComponent } from '../ui/icon/icon.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PersonCardComponent } from './person-card/person-card.component';
import { EditPersonFormComponent, PersonFormData } from '../transaction-view/edit-person-form/edit-person-form.component';

@Component({
  selector: 'app-person-list',
  imports: [
    CommonModule, 
    ButtonComponent, 
    ModalComponent,
    ConfirmDialogComponent,
    IconComponent,
    AppHeaderComponent,
    SearchBarComponent,
    PersonCardComponent,
    EditPersonFormComponent
  ],
  templateUrl: './person-list.component.html',
  styles: []
})
export class PersonListComponent implements OnInit {
  private router = inject(Router);
  private personService = inject(PersonService);
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  searchTerm = signal<string>('');
  people = computed(() => {
    const term = this.searchTerm();
    if (!term) {
      return this.personService.people();
    }
    return this.personService.searchPeople(term);
  });

  // Add Person Modal
  showAddModal = signal<boolean>(false);
  addPersonData = signal<PersonFormData>({
    name: '',
    phone: '',
    address: ''
  });

  // Edit Person Modal
  showEditModal = signal<boolean>(false);
  editingPersonId = signal<string>('');
  editPersonData = signal<PersonFormData>({
    name: '',
    phone: '',
    address: ''
  });

  // Confirm Dialog
  showConfirmDialog = signal<boolean>(false);
  confirmMessage = signal<string>('');
  confirmCallback = signal<(() => void) | null>(null);

  currentUser = this.authService.currentUser;

  ngOnInit(): void {
    // Component initialized
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  openAddModal(): void {
    this.addPersonData.set({
      name: '',
      phone: '',
      address: ''
    });
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
  }

  addPerson(formData: PersonFormData): void {
    if (!formData.name.trim()) {
      this.alertService.showError('لطفاً نام شخص را وارد کنید.');
      return;
    }

    const dto: CreatePersonDto = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim()
    };

    this.personService.addPerson(dto);
    this.alertService.showSuccess('شخص با موفقیت اضافه شد.');
    this.closeAddModal();
  }

  openEditModal(person: Person): void {
    this.editingPersonId.set(person.id);
    this.editPersonData.set({
      name: person.name,
      phone: person.phone || '',
      address: person.address || ''
    });
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
  }

  saveEditedPerson(formData: PersonFormData): void {
    if (!formData.name.trim()) {
      this.alertService.showError('لطفاً نام شخص را وارد کنید.');
      return;
    }

    const dto: Partial<CreatePersonDto> = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim()
    };

    const result = this.personService.updatePerson(this.editingPersonId(), dto);
    
    if (result) {
      this.alertService.showSuccess('مشخصات شخص با موفقیت به‌روزرسانی شد.');
      this.closeEditModal();
    } else {
      this.alertService.showError('خطا در به‌روزرسانی شخص.');
    }
  }

  // confirmDeletePerson(personId: string): void {
  //   this.confirmMessage.set('آیا از حذف این شخص و تمام تراکنش‌های مرتبط با او مطمئن هستید؟');
  //   this.confirmCallback.set(() => this.deletePerson(personId));
  //   this.showConfirmDialog.set(true);
  // }

  deletePerson(personId: string): void {
    this.transactionService.deleteTransactionsByPersonId(personId);
    const success = this.personService.deletePerson(personId);
    
    if (success) {
      this.alertService.showSuccess('شخص با موفقیت حذف شد.');
    } else {
      this.alertService.showError('خطا در حذف شخص.');
    }
  }

  onConfirm(confirmed: boolean): void {
    this.showConfirmDialog.set(false);
    
    if (confirmed && this.confirmCallback()) {
      this.confirmCallback()!();
    }
    
    this.confirmCallback.set(null);
  }

  viewTransactions(person: Person): void {
    this.router.navigate(['/transactions', person.id]);
  }

  // exportData(): void {
  //   this.exportService.exportToJson();
  //   this.alertService.showSuccess('خروجی با موفقیت ایجاد شد.');
  // }

  logout(): void {
    this.authService.logout();
  }
}
