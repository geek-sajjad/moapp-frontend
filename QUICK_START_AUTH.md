# Quick Start Guide - Authentication Setup

## 🚀 What's Been Done

Your Angular application now has **complete JWT authentication** with access tokens and refresh tokens integrated!

## ⚙️ Configuration (Required)

### Step 1: Set Your Backend API URL

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000', // 👈 CHANGE THIS to your backend URL
};
```

For production, edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api.com', // 👈 Your production API URL
};
```

## 🔌 Backend Requirements

Your NestJS backend needs these two endpoints:

### 1. Login Endpoint

```typescript
POST /auth/login

Request Body:
{
  "username": "janedoe",
  "password": "strongpassword123"
}

Response (200):
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
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

### 2. Refresh Token Endpoint

```typescript
POST /auth/refresh-token

Request Body:
{
  "refreshToken": "your-refresh-token-here"
}

Response (200):
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

## ✅ Testing Checklist

### Frontend Setup
- [ ] Update `apiUrl` in `src/environments/environment.ts`
- [ ] Run `npm install` (if needed)
- [ ] Run `ng serve` or `npm start`
- [ ] Navigate to `http://localhost:4200/login`

### Backend Setup
- [ ] Ensure backend is running
- [ ] CORS is enabled for your frontend URL
- [ ] `/auth/login` endpoint is working
- [ ] `/auth/refresh-token` endpoint is working
- [ ] JWT tokens are properly generated

### Test Login
- [ ] Open browser to `/login`
- [ ] Enter valid credentials
- [ ] Check for success message
- [ ] Verify redirect to `/people`
- [ ] Open DevTools > Application > Local Storage
- [ ] Verify tokens are stored:
  - `moein_access_token`
  - `moein_refresh_token`
  - `moein_user_info`

### Test Token Refresh
- [ ] After login, open DevTools > Network tab
- [ ] Clear network log
- [ ] Navigate to a protected route
- [ ] Wait for token to expire (or manually delete access token)
- [ ] Make an API call
- [ ] Should see automatic refresh token request
- [ ] Original request should succeed with new token

### Test Error Handling
- [ ] Try login with wrong credentials
- [ ] Should show error: `نام کاربری یا رمز عبور اشتباه است`
- [ ] Try login with empty fields
- [ ] Should show error: `لطفاً نام کاربری و رمز عبور را وارد کنید`

### Test Logout
- [ ] Login successfully
- [ ] Click logout button
- [ ] Verify redirect to `/login`
- [ ] Check Local Storage - tokens should be cleared
- [ ] Try accessing protected route
- [ ] Should redirect back to login

## 🎯 How It Works

### Login Flow
1. User enters credentials in login form
2. Frontend calls `POST /auth/login`
3. Backend validates credentials
4. Backend returns access token, refresh token, and user info
5. Frontend stores tokens in localStorage
6. User is redirected to dashboard

### Protected API Calls
1. User makes API request (e.g., get transactions)
2. HTTP Interceptor adds: `Authorization: Bearer <access-token>`
3. Backend validates token
4. Returns data

### Token Refresh (Automatic)
1. API returns 401 Unauthorized (token expired)
2. HTTP Interceptor catches the error
3. Calls `POST /auth/refresh-token` with refresh token
4. Backend returns new tokens
5. Updates tokens in localStorage
6. Retries original API request
7. Returns data to user

### Logout
1. User clicks logout
2. Tokens removed from localStorage
3. User redirected to `/login`

## 📁 Files Modified/Created

### Created:
- ✅ `src/environments/environment.ts` - Development config
- ✅ `src/environments/environment.prod.ts` - Production config
- ✅ `src/app/models/auth.model.ts` - Auth interfaces
- ✅ `src/app/interceptors/auth.interceptor.ts` - Token interceptor

### Modified:
- ✅ `src/app/services/auth.service.ts` - Real API integration
- ✅ `src/app/components/login/login.component.ts` - Async handling
- ✅ `src/app/components/login/login-form/login-form.component.ts` - Loading state
- ✅ `src/app/components/login/login-form/login-form.component.html` - UI updates
- ✅ `src/app/app.config.ts` - Registered interceptor
- ✅ `src/app/guards/auth.guard.ts` - Token-based guards

## 🐛 Troubleshooting

### Problem: CORS Error
**Solution:** Enable CORS in your NestJS backend:
```typescript
// main.ts
app.enableCors({
  origin: 'http://localhost:4200',
  credentials: true,
});
```

### Problem: 401 Unauthorized Loop
**Solution:** Check that `/auth/refresh-token` is excluded from auth middleware in backend

### Problem: Tokens Not Saving
**Solution:** Check browser console for errors. Some browsers block localStorage in private mode.

### Problem: Cannot Connect to Backend
**Solution:** 
1. Verify backend is running
2. Check `apiUrl` in environment.ts
3. Check network tab for exact error

## 📚 Documentation

Full documentation available in:
- **`API_INTEGRATION.md`** - Complete API documentation
- **`IMPLEMENTATION_SUMMARY.md`** - What was implemented

## 🔐 Security Notes

1. **HTTPS in Production:** Always use HTTPS in production
2. **Secure Storage:** Consider httpOnly cookies for production
3. **Token Expiration:** Set appropriate expiration times on backend
4. **CORS:** Configure strict CORS policies
5. **XSS Protection:** All user inputs are sanitized

## 🎉 Ready to Go!

Once you've:
1. ✅ Updated the API URL
2. ✅ Configured your backend
3. ✅ Tested the login flow

Your authentication system is **fully operational**! 🚀

## Need Help?

Check the detailed documentation files:
- `API_INTEGRATION.md` - Comprehensive guide
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
