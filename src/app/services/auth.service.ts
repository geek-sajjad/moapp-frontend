import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'moein_auth';
  private readonly CREDENTIALS = { username: 'admin', password: 'admin' }; // Mock credentials
  
  private currentUserSignal = signal<string | null>(null);
  currentUser = this.currentUserSignal.asReadonly();
  
  isAuthenticated = signal<boolean>(false);

  constructor(private router: Router) {
    this.checkAuth();
  }

  login(username: string, password: string): boolean {
    // Simple mock authentication - in real app, this would be an API call
    if (username === this.CREDENTIALS.username && password === this.CREDENTIALS.password) {
      this.currentUserSignal.set(username);
      this.isAuthenticated.set(true);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ username }));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  checkAuth(): boolean {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const { username } = JSON.parse(data);
        this.currentUserSignal.set(username);
        this.isAuthenticated.set(true);
        return true;
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
    return false;
  }
}
