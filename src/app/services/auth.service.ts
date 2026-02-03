import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, map, delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { 
  LoginRequest, 
  LoginResponse, 
  RefreshTokenRequest, 
  RefreshTokenResponse, 
  UserInfo 
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'moein_access_token';
  private readonly REFRESH_TOKEN_KEY = 'moein_refresh_token';
  private readonly USER_INFO_KEY = 'moein_user_info';
  
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSignal = signal<UserInfo | null>(null);
  currentUser = this.currentUserSignal.asReadonly();
  
  isAuthenticated = signal<boolean>(false);
  
  private isRefreshingToken = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    this.checkAuth();
  }

  /**
   * Login with username and password
   */
  login(username: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = { username, password };
    
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, loginData).pipe(
      delay(2000),
      tap((response) => {
        this.handleLoginSuccess(response);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handle successful login response
   */
  private handleLoginSuccess(response: LoginResponse): void {
    const { accessToken, refreshToken, userId, username, fullName } = response.data;
    
    // Store tokens
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    
    // Store user info
    const userInfo: UserInfo = { userId, username, fullName };
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
    
    // Update signals
    this.currentUserSignal.set(userInfo);
    this.isAuthenticated.set(true);
  }

  /**
   * Refresh the access token using refresh token
   */
  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    const refreshData: RefreshTokenRequest = { refreshToken };
    
    this.isRefreshingToken = true;
    
    return this.http.post<RefreshTokenResponse>(
      `${environment.apiUrl}/auth/refresh-token`, 
      refreshData
    ).pipe(
      tap((response) => {
        this.isRefreshingToken = false;
        
        // Update tokens
        localStorage.setItem(this.ACCESS_TOKEN_KEY, response.data.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.data.refreshToken);
        
        this.refreshTokenSubject.next(response.data.accessToken);
      }),
      catchError((error) => {
        this.isRefreshingToken = false;
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user and clear all stored data
   */
  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
    
    this.currentUserSignal.set(null);
    this.isAuthenticated.set(false);
    
    this.router.navigate(['/login']);
  }

  /**
   * Check if user is authenticated on app initialization
   */
  checkAuth(): boolean {
    try {
      const accessToken = this.getAccessToken();
      const userInfoData = localStorage.getItem(this.USER_INFO_KEY);
      
      if (accessToken && userInfoData) {
        const userInfo: UserInfo = JSON.parse(userInfoData);
        this.currentUserSignal.set(userInfo);
        this.isAuthenticated.set(true);
        return true;
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      this.clearAuthData();
    }
    return false;
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get current user info
   */
  getUserInfo(): UserInfo | null {
    try {
      const userInfoData = localStorage.getItem(this.USER_INFO_KEY);
      return userInfoData ? JSON.parse(userInfoData) : null;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }

  /**
   * Check if access token exists (for guard)
   */
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
    this.currentUserSignal.set(null);
    this.isAuthenticated.set(false);
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'خطای ناشناخته رخ داده است';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `خطا: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'نام کاربری یا رمز عبور اشتباه است';
          break;
        case 403:
          errorMessage = 'دسترسی غیرمجاز';
          break;
        case 404:
          errorMessage = 'سرویس یافت نشد';
          break;
        case 500:
          errorMessage = 'خطای سرور';
          break;
        default:
          errorMessage = error.error?.message || 'خطا در ارتباط با سرور';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
