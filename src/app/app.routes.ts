import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { TransactionViewComponent } from './components/transaction-view/transaction-view.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/customers',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'customers',
    component: CustomerListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'people',
    redirectTo: '/customers',
    pathMatch: 'full'
  },
  {
    path: 'transactions/:id',
    component: TransactionViewComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/customers'
  }
];
