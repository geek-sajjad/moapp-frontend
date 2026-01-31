import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PersonListComponent } from './components/person-list/person-list.component';
import { TransactionViewComponent } from './components/transaction-view/transaction-view.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/people',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'people',
    component: PersonListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transactions/:id',
    component: TransactionViewComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/people'
  }
];
