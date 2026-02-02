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
import { CustomerCardComponent } from './customer-card/customer-card.component';
import { EditPersonFormComponent, PersonFormData } from '../transaction-view/edit-person-form/edit-person-form.component';

@Component({
  selector: 'app-customer-list',
  imports: [
    CommonModule, 
    ButtonComponent, 
    ModalComponent,
    ConfirmDialogComponent,
    IconComponent,
    AppHeaderComponent,
    SearchBarComponent,
    CustomerCardComponent,
    EditPersonFormComponent
  ],
  templateUrl: './customer-list.component.html',
  styles: []
})
export class CustomerListComponent implements OnInit {
  private router = inject(Router);
  private personService = inject(PersonService);
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  searchTerm = signal<string>('');
  customers = computed(() => {
    const term = this.searchTerm();
    if (!term) {
      return this.personService.people();
    }
    return this.personService.searchPeople(term);
  });

  // Add Customer Modal
  showAddModal = signal<boolean>(false);
  addCustomerData = signal<PersonFormData>({
    name: '',
    phone: '',
    address: ''
  });

  // Edit Customer Modal
  showEditModal = signal<boolean>(false);
  editingCustomerId = signal<string>('');
  editCustomerData = signal<PersonFormData>({
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
    this.addCustomerData.set({
      name: '',
      phone: '',
      address: ''
    });
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
  }

  addCustomer(formData: PersonFormData): void {
    if (!formData.name.trim()) {
      this.alertService.showError('لطفاً نام مشتری را وارد کنید.');
      return;
    }

    const dto: CreatePersonDto = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim()
    };

    this.personService.addPerson(dto);
    this.alertService.showSuccess('مشتری با موفقیت اضافه شد.');
    this.closeAddModal();
  }

  openEditModal(customer: Person): void {
    this.editingCustomerId.set(customer.id);
    this.editCustomerData.set({
      name: customer.name,
      phone: customer.phone || '',
      address: customer.address || ''
    });
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
  }

  saveEditedCustomer(formData: PersonFormData): void {
    if (!formData.name.trim()) {
      this.alertService.showError('لطفاً نام مشتری را وارد کنید.');
      return;
    }

    const dto: Partial<CreatePersonDto> = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim()
    };

    const result = this.personService.updatePerson(this.editingCustomerId(), dto);
    
    if (result) {
      this.alertService.showSuccess('مشخصات مشتری با موفقیت به‌روزرسانی شد.');
      this.closeEditModal();
    } else {
      this.alertService.showError('خطا در به‌روزرسانی مشتری.');
    }
  }

  // confirmDeleteCustomer(customerId: string): void {
  //   this.confirmMessage.set('آیا از حذف این مشتری و تمام تراکنش‌های مرتبط با او مطمئن هستید؟');
  //   this.confirmCallback.set(() => this.deleteCustomer(customerId));
  //   this.showConfirmDialog.set(true);
  // }

  deleteCustomer(customerId: string): void {
    this.transactionService.deleteTransactionsByPersonId(customerId);
    const success = this.personService.deletePerson(customerId);
    
    if (success) {
      this.alertService.showSuccess('مشتری با موفقیت حذف شد.');
    } else {
      this.alertService.showError('خطا در حذف مشتری.');
    }
  }

  onConfirm(confirmed: boolean): void {
    this.showConfirmDialog.set(false);
    
    if (confirmed && this.confirmCallback()) {
      this.confirmCallback()!();
    }
    
    this.confirmCallback.set(null);
  }

  viewTransactions(customer: Person): void {
    this.router.navigate(['/transactions', customer.id]);
  }

  // exportData(): void {
  //   this.exportService.exportToJson();
  //   this.alertService.showSuccess('خروجی با موفقیت ایجاد شد.');
  // }

  logout(): void {
    this.authService.logout();
  }
}
