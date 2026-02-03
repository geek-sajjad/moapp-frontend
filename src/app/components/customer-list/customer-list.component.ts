import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '../../models/customer.model';
import { ButtonComponent } from '../ui/button/button.component';
import { ModalComponent } from '../ui/modal/modal.component';
import { ConfirmDialogComponent } from '../ui/confirm-dialog/confirm-dialog.component';
import { IconComponent } from '../ui/icon/icon.component';
import { ToggleComponent } from '../ui/toggle/toggle.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { CustomerCardComponent } from './customer-card/customer-card.component';
import { CustomerFormComponent, CustomerFormData } from './customer-form/customer-form.component';

@Component({
  selector: 'app-customer-list',
  imports: [
    CommonModule, 
    ButtonComponent, 
    ModalComponent,
    ConfirmDialogComponent,
    IconComponent,
    ToggleComponent,
    AppHeaderComponent,
    SearchBarComponent,
    CustomerCardComponent,
    CustomerFormComponent
  ],
  templateUrl: './customer-list.component.html',
  styles: []
})
export class CustomerListComponent implements OnInit {
  private router = inject(Router);
  private customerService = inject(CustomerService);
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  searchTerm = signal<string>('');
  isLoading = signal<boolean>(false);
  includeArchived = signal<boolean>(false);
  
  customers = computed(() => {
    const term = this.searchTerm();
    if (!term) {
      return this.customerService.customers();
    }
    return this.customerService.searchCustomers(term);
  });

  // Add Customer Modal
  showAddModal = signal<boolean>(false);
  addCustomerData = signal<CustomerFormData>({
    name: '',
    phoneNumber: '',
    description: ''
  });

  // Edit Customer Modal
  showEditModal = signal<boolean>(false);
  editingCustomerId = signal<string>('');
  editCustomerData = signal<CustomerFormData>({
    name: '',
    phoneNumber: '',
    description: ''
  });

  // Confirm Dialog
  showConfirmDialog = signal<boolean>(false);
  confirmMessage = signal<string>('');
  confirmCallback = signal<(() => void) | null>(null);

  currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading.set(true);
    this.customerService.getCustomers(this.includeArchived()).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error loading customers:', error);
        this.alertService.showError('خطا در بارگذاری لیست مشتریان');
      }
    });
  }

  onToggleArchived(includeArchived: boolean): void {
    this.includeArchived.set(includeArchived);
    this.loadCustomers();
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  openAddModal(): void {
    this.addCustomerData.set({
      name: '',
      phoneNumber: '',
      description: ''
    });
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
  }

  addCustomer(formData: CustomerFormData): void {
    if (!formData.name.trim()) {
      this.alertService.showError('لطفاً نام مشتری را وارد کنید.');
      return;
    }

    if (!formData.phoneNumber.trim()) {
      this.alertService.showError('لطفاً شماره تماس را وارد کنید.');
      return;
    }

    const dto: CreateCustomerDto = {
      name: formData.name.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      description: formData.description.trim() || undefined
    };

    this.isLoading.set(true);
    this.customerService.createCustomer(dto).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.alertService.showSuccess('مشتری با موفقیت اضافه شد.');
        this.closeAddModal();
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error creating customer:', error);
        this.alertService.showError('خطا در افزودن مشتری');
      }
    });
  }

  openEditModal(customer: Customer): void {
    this.editingCustomerId.set(customer.id);
    this.editCustomerData.set({
      name: customer.name,
      phoneNumber: customer.phoneNumber || '',
      description: customer.description || '',
      id: customer.id,
      isArchived: customer.isArchived
    });
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
  }

  saveEditedCustomer(formData: CustomerFormData): void {
    if (!formData.name.trim()) {
      this.alertService.showError('لطفاً نام مشتری را وارد کنید.');
      return;
    }

    if (!formData.phoneNumber.trim()) {
      this.alertService.showError('لطفاً شماره تماس را وارد کنید.');
      return;
    }

    const dto: UpdateCustomerDto = {
      name: formData.name.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      description: formData.description.trim() || undefined
    };

    this.isLoading.set(true);
    this.customerService.updateCustomer(this.editingCustomerId(), dto).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.alertService.showSuccess('مشخصات مشتری با موفقیت به‌روزرسانی شد.');
        this.closeEditModal();
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error updating customer:', error);
        this.alertService.showError('خطا در به‌روزرسانی مشتری');
      }
    });
  }

  archiveCustomer(customerId: string): void {
    this.isLoading.set(true);
    this.customerService.archiveCustomer(customerId).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.alertService.showSuccess('مشتری با موفقیت آرشیو شد.');
        this.closeEditModal();
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error archiving customer:', error);
        this.alertService.showError('خطا در آرشیو مشتری');
      }
    });
  }

  unarchiveCustomer(customerId: string): void {
    this.isLoading.set(true);
    this.customerService.unarchiveCustomer(customerId).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.alertService.showSuccess('مشتری با موفقیت از آرشیو خارج شد.');
        this.closeEditModal();
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error unarchiving customer:', error);
        this.alertService.showError('خطا در خروج از آرشیو مشتری');
      }
    });
  }

  confirmDeleteCustomer(customerId: string): void {
    this.confirmMessage.set('آیا از حذف این مشتری مطمئن هستید؟');
    this.confirmCallback.set(() => this.deleteCustomer(customerId));
    this.showConfirmDialog.set(true);
  }

  deleteCustomer(customerId: string): void {
    this.isLoading.set(true);
    this.customerService.deleteCustomer(customerId).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Note: Backend should handle cascading delete of transactions
        this.alertService.showSuccess('مشتری با موفقیت حذف شد.');
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error deleting customer:', error);
        this.alertService.showError('خطا در حذف مشتری');
      }
    });
  }

  onConfirm(confirmed: boolean): void {
    this.showConfirmDialog.set(false);
    
    if (confirmed && this.confirmCallback()) {
      this.confirmCallback()!();
    }
    
    this.confirmCallback.set(null);
  }

  viewTransactions(customer: Customer): void {
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
