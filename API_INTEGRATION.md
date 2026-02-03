# API Integration Documentation

## Overview

This document describes the authentication API integration implemented in the Daftar Moein application. The system uses JWT tokens (access token and refresh token) for secure authentication.

## Architecture

### Components

1. **AuthService** (`src/app/services/auth.service.ts`)
   - Handles all authentication operations
   - Manages token storage and retrieval
   - Provides automatic token refresh functionality

2. **Auth Interceptor** (`src/app/interceptors/auth.interceptor.ts`)
   - Automatically adds access token to API requests
   - Intercepts 401 errors and refreshes tokens
   - Handles token refresh failures

3. **Auth Models** (`src/app/models/auth.model.ts`)
   - TypeScript interfaces for API requests and responses
   - Type-safe authentication data structures

4. **Environment Configuration** (`src/environments/`)
   - Configurable API base URL for different environments

## API Endpoints

### 1. Login

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "username": "janedoe",
  "password": "strongpassword123"
}
```

**Response (Success - 200):**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9-refresh...",
    "userId": "uuid-here",
    "username": "janedoe",
    "fullName": "Jane Doe"
  },
  "meta": {
    "timestamp": 1737733273126,
    "date": "2025-01-24 19:12:00"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

### 2. Refresh Token

**Endpoint:** `POST /auth/refresh-token`

**Request:**
```json
{
  "refreshToken": "your-refresh-token-here"
}
```

**Response (Success - 200):**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "meta": {
    "timestamp": 1737733273126,
    "date": "2025-01-24 19:12:00"
  }
}
```

## Token Management

### Storage

Tokens and user information are stored in `localStorage`:

- **Access Token:** `moein_access_token`
- **Refresh Token:** `moein_refresh_token`
- **User Info:** `moein_user_info` (JSON string containing userId, username, fullName)

### Automatic Token Refresh

The HTTP interceptor automatically handles token refresh:

1. When an API request receives a 401 response
2. The interceptor attempts to refresh the token using the refresh token
3. If successful, the original request is retried with the new access token
4. If refresh fails, the user is logged out and redirected to login page

### Token Inclusion in Requests

All API requests (except `/auth/login` and `/auth/refresh-token`) automatically include the access token in the `Authorization` header:

```
Authorization: Bearer <access-token>
```

## Configuration

### API Base URL

Update the API base URL in the environment files:

**Development:** `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000', // Your backend API URL
};
```

**Production:** `src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api-url.com',
};
```

## Usage Examples

### Login

```typescript
import { AuthService } from './services/auth.service';

constructor(private authService: AuthService) {}

login() {
  this.authService.login('username', 'password').subscribe({
    next: (response) => {
      console.log('Login successful:', response.data.fullName);
      // Navigate to dashboard
    },
    error: (error) => {
      console.error('Login failed:', error.message);
    }
  });
}
```

### Logout

```typescript
logout() {
  this.authService.logout();
  // User is automatically redirected to login page
}
```

### Check Authentication Status

```typescript
// Check if user is authenticated
const isAuth = this.authService.isAuthenticated();

// Get current user info
const userInfo = this.authService.getUserInfo();
console.log(userInfo?.fullName);

// Get access token
const token = this.authService.getAccessToken();
```

### Making Authenticated API Requests

Simply make HTTP requests as usual - the interceptor handles token injection:

```typescript
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

constructor(private http: HttpClient) {}

getData() {
  // Access token is automatically added by the interceptor
  return this.http.get(`${environment.apiUrl}/api/data`);
}
```

## Security Considerations

1. **Token Storage:** Tokens are stored in localStorage. For enhanced security in production:
   - Consider using httpOnly cookies for refresh tokens
   - Implement HTTPS in production
   - Set appropriate CORS policies on the backend

2. **Token Expiration:** The interceptor handles token refresh automatically when receiving 401 responses

3. **XSS Protection:** Sanitize all user inputs to prevent XSS attacks

4. **CSRF Protection:** Implement CSRF tokens if using cookie-based authentication

## Error Handling

The AuthService includes comprehensive error handling:

- **Network Errors:** Displays user-friendly Persian error messages
- **401 Unauthorized:** Automatic token refresh attempt
- **403 Forbidden:** Access denied message
- **404 Not Found:** Service not found message
- **500 Server Error:** Server error message

All error messages are displayed in Persian for better UX.

## Testing

### Test Login Flow

1. Update `apiUrl` in `environment.ts` to point to your backend
2. Run the application: `npm start`
3. Navigate to `/login`
4. Enter valid credentials
5. Verify successful login and redirection
6. Check browser DevTools > Application > Local Storage for stored tokens

### Test Token Refresh

1. Login successfully
2. Wait for access token to expire (or manually expire it)
3. Make an API request
4. Verify the interceptor automatically refreshes the token
5. Check Network tab in DevTools for refresh token request

### Test Logout

1. Login successfully
2. Click logout button
3. Verify tokens are cleared from localStorage
4. Verify redirection to login page

## Troubleshooting

### Issue: CORS Errors

**Solution:** Configure CORS on your backend to allow requests from your frontend origin.

### Issue: Tokens Not Persisting

**Solution:** Check browser privacy settings - some browsers block localStorage in private/incognito mode.

### Issue: Infinite Refresh Loop

**Solution:** Verify refresh token endpoint is excluded in the interceptor and returns valid tokens.

### Issue: 401 After Refresh

**Solution:** Check if refresh token has expired. User needs to login again.

## Backend Requirements

Your NestJS backend should implement:

1. **POST /auth/login** - Validate credentials and return tokens
2. **POST /auth/refresh-token** - Validate refresh token and return new tokens
3. **JWT Validation Middleware** - Validate access tokens on protected routes
4. **Token Expiration** - Set appropriate expiration times (e.g., 15min for access, 7days for refresh)

Example NestJS setup:
```typescript
// auth.controller.ts
@Post('login')
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}

@Post('refresh-token')
async refreshToken(@Body() refreshDto: RefreshTokenDto) {
  return this.authService.refreshToken(refreshDto.refreshToken);
}
```

## Future Enhancements

1. Implement remember me functionality
2. Add biometric authentication support
3. Implement social login (OAuth)
4. Add multi-factor authentication (MFA)
5. Implement token rotation strategy
6. Add rate limiting on login attempts
7. Implement password reset flow
