# Authentication Flow Diagrams

## 🔐 Complete Authentication Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Angular Frontend Application                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐│
│  │  Login Component │─────▶│  Auth Service    │─────▶│ HTTP Interceptor││
│  │  (UI/Form)       │      │  (Business Logic)│      │ (Token Manager) ││
│  └─────────────────┘      └──────────────────┘      └─────────────────┘│
│           │                        │                          │          │
│           │                        │                          │          │
│           ▼                        ▼                          ▼          │
│  ┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐│
│  │  Login Form     │      │  Token Storage   │      │  HTTP Client    ││
│  │  Component      │      │  (localStorage)  │      │  (Angular)      ││
│  └─────────────────┘      └──────────────────┘      └─────────────────┘│
│                                                               │          │
└───────────────────────────────────────────────────────────────┼──────────┘
                                                                │
                                                                │ HTTP/HTTPS
                                                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         NestJS Backend API                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐│
│  │ Auth Controller │─────▶│   Auth Service   │─────▶│  JWT Service    ││
│  │ (Endpoints)     │      │  (Business Logic)│      │  (Token Gen)    ││
│  └─────────────────┘      └──────────────────┘      └─────────────────┘│
│           │                        │                          │          │
│           │                        ▼                          │          │
│           │               ┌──────────────────┐               │          │
│           │               │  User Service /  │               │          │
│           │               │  Database        │               │          │
│           │               └──────────────────┘               │          │
│           │                                                   │          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  Protected Routes (with JWT Guards)                                 ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## 📝 Flow 1: Initial Login

```
User                 Frontend              Backend               Database
 │                      │                     │                      │
 │  1. Enter           │                     │                      │
 │     Credentials     │                     │                      │
 ├─────────────────────▶                     │                      │
 │                      │                     │                      │
 │                      │  2. POST /auth/login                       │
 │                      │     {username, pwd} │                      │
 │                      ├────────────────────▶                       │
 │                      │                     │                      │
 │                      │                     │  3. Validate User    │
 │                      │                     ├─────────────────────▶
 │                      │                     │                      │
 │                      │                     │  4. User Found       │
 │                      │                     ◀─────────────────────┤
 │                      │                     │                      │
 │                      │                     │  5. Generate Tokens  │
 │                      │                     │     (Access + Refresh)
 │                      │                     │                      │
 │                      │  6. Return Tokens   │                      │
 │                      │     + User Info     │                      │
 │                      ◀────────────────────┤                      │
 │                      │                     │                      │
 │                      │  7. Store Tokens    │                      │
 │                      │     in localStorage │                      │
 │                      │                     │                      │
 │  8. Redirect to      │                     │                      │
 │     Dashboard        │                     │                      │
 ◀─────────────────────┤                     │                      │
 │                      │                     │                      │
```

## 🔄 Flow 2: Making Authenticated API Requests

```
Frontend              Interceptor           Backend               
 │                        │                     │                  
 │  1. API Request        │                     │                  
 │     (e.g., GET /api/   │                     │                  
 │      transactions)     │                     │                  
 ├───────────────────────▶│                     │                  
 │                        │                     │                  
 │                        │  2. Get Access      │                  
 │                        │     Token from      │                  
 │                        │     localStorage    │                  
 │                        │                     │                  
 │                        │  3. Add Header:     │                  
 │                        │     Authorization:  │                  
 │                        │     Bearer <token>  │                  
 │                        │                     │                  
 │                        │  4. Forward Request │                  
 │                        │     with Token      │                  
 │                        ├────────────────────▶│                  
 │                        │                     │                  
 │                        │                     │  5. Validate JWT 
 │                        │                     │                  
 │                        │  6. Return Data     │                  
 │                        ◀────────────────────┤                  
 │                        │                     │                  
 │  7. Receive Data       │                     │                  
 ◀───────────────────────┤                     │                  
 │                        │                     │                  
```

## 🔄 Flow 3: Automatic Token Refresh

```
Frontend              Interceptor           Backend               
 │                        │                     │                  
 │  1. API Request        │                     │                  
 ├───────────────────────▶│                     │                  
 │                        │                     │                  
 │                        │  2. Add Access      │                  
 │                        │     Token (Expired) │                  
 │                        │                     │                  
 │                        │  3. Send Request    │                  
 │                        ├────────────────────▶│                  
 │                        │                     │                  
 │                        │                     │  4. Validate JWT 
 │                        │                     │     ❌ EXPIRED!  
 │                        │                     │                  
 │                        │  5. Return 401      │                  
 │                        │     Unauthorized    │                  
 │                        ◀────────────────────┤                  
 │                        │                     │                  
 │                        │  6. Catch 401 Error │                  
 │                        │                     │                  
 │                        │  7. POST /auth/     │                  
 │                        │     refresh-token   │                  
 │                        │     {refreshToken}  │                  
 │                        ├────────────────────▶│                  
 │                        │                     │                  
 │                        │                     │  8. Validate     
 │                        │                     │     Refresh Token
 │                        │                     │                  
 │                        │  9. Return New      │                  
 │                        │     Tokens          │                  
 │                        ◀────────────────────┤                  
 │                        │                     │                  
 │                        │  10. Update Tokens  │                  
 │                        │      in localStorage│                  
 │                        │                     │                  
 │                        │  11. Retry Original │                  
 │                        │      Request with   │                  
 │                        │      New Token      │                  
 │                        ├────────────────────▶│                  
 │                        │                     │                  
 │                        │  12. Return Data    │                  
 │                        ◀────────────────────┤                  
 │                        │                     │                  
 │  13. Receive Data      │                     │                  
 │      (User unaware     │                     │                  
 │       of refresh!)     │                     │                  
 ◀───────────────────────┤                     │                  
 │                        │                     │                  
```

## 🚪 Flow 4: Logout

```
User                 Frontend                 localStorage
 │                      │                         │
 │  1. Click Logout     │                         │
 ├─────────────────────▶│                         │
 │                      │                         │
 │                      │  2. Remove Tokens       │
 │                      ├────────────────────────▶│
 │                      │   - access_token        │
 │                      │   - refresh_token       │
 │                      │   - user_info           │
 │                      │                         │
 │                      │  3. Clear Auth State    │
 │                      │     (signals)           │
 │                      │                         │
 │  4. Redirect to      │                         │
 │     Login Page       │                         │
 ◀─────────────────────┤                         │
 │                      │                         │
```

## 🔒 Flow 5: Accessing Protected Route (Unauthorized)

```
User                 Auth Guard            Auth Service         Router
 │                      │                      │                   │
 │  1. Navigate to      │                      │                   │
 │     /people          │                      │                   │
 ├─────────────────────▶│                      │                   │
 │                      │                      │                   │
 │                      │  2. Check Auth       │                   │
 │                      ├─────────────────────▶│                   │
 │                      │                      │                   │
 │                      │  3. No Token Found   │                   │
 │                      │     ❌               │                   │
 │                      ◀─────────────────────┤                   │
 │                      │                      │                   │
 │                      │  4. Redirect to      │                   │
 │                      │     /login           │                   │
 │                      │     ?returnUrl=/people                   │
 │                      ├──────────────────────────────────────────▶
 │                      │                      │                   │
 │  5. Show Login Page  │                      │                   │
 ◀─────────────────────┴──────────────────────┴───────────────────┘
 │                                                                  
```

## 📦 Data Storage Structure

### localStorage Keys:

```
┌─────────────────────────────────────────────────────────────┐
│  localStorage                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  moein_access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."    │
│                                                             │
│  moein_refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."   │
│                                                             │
│  moein_user_info: {                                         │
│    "userId": "123e4567-e89b-12d3-a456-426614174000",       │
│    "username": "janedoe",                                   │
│    "fullName": "Jane Doe"                                   │
│  }                                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Component Interaction Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                      Login Component                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │            Login Form Component                            │  │
│  │  ┌────────────────────────────────────────────────────┐    │  │
│  │  │  Username Input: [___________________]             │    │  │
│  │  │  Password Input: [___________________]             │    │  │
│  │  │                                                     │    │  │
│  │  │  [Loading Spinner] or [Login Button]              │    │  │
│  │  │                                                     │    │  │
│  │  │  Error Message: ⚠️ [Error Text]                    │    │  │
│  │  └────────────────────────────────────────────────────┘    │  │
│  │                            │                                │  │
│  │                            │ emit onSubmit(credentials)     │  │
│  │                            ▼                                │  │
│  └─────────────────────────────────────────────────────────────  │
│                              │                                   │
│                              │ handleLogin()                     │
│                              ▼                                   │
│                    ┌──────────────────┐                          │
│                    │   AuthService    │                          │
│                    │   .login()       │                          │
│                    └──────────────────┘                          │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐             │
│         │                    │                    │             │
│         ▼                    ▼                    ▼             │
│   ✅ Success           ❌ Error            ⏳ Loading           │
│   - Store tokens       - Show error        - Disable form      │
│   - Update signals     - Keep form open    - Show spinner      │
│   - Show welcome       - Re-enable form    - Prevent submit    │
│   - Navigate away                                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## 🔑 Token Lifecycle

```
Time ────────────────────────────────────────────────────────▶

Login
  │
  ├─ Generate Access Token (expires: 15 min)
  │
  ├─ Generate Refresh Token (expires: 7 days)
  │
  ▼
[─────────────────────] Access Token Valid (15 min)
  │                   │
  │                   │
  │                   ▼
  │                Token Expired
  │                   │
  │                   ├─ Auto Refresh Triggered
  │                   │
  │                   ▼
  │                New Access Token (expires: 15 min)
  │                   │
  │                   │
  ▼                   ▼
[━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━] Refresh Token Valid (7 days)
                                    │
                                    ▼
                              Refresh Expired
                                    │
                                    ├─ Logout User
                                    │
                                    ▼
                              Redirect to Login
```

## 📊 Authentication State Management

```
┌─────────────────────────────────────────────────────────────┐
│                     Auth Service Signals                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  currentUser: Signal<UserInfo | null>                       │
│  ├─ Initially: null                                          │
│  ├─ After Login: { userId, username, fullName }             │
│  └─ After Logout: null                                       │
│                                                              │
│  isAuthenticated: Signal<boolean>                            │
│  ├─ Initially: false                                         │
│  ├─ After Login: true                                        │
│  ├─ After Token Check: true (if valid)                       │
│  └─ After Logout: false                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘

These signals automatically trigger UI updates across the app!
```

## 🛡️ Security Layers

```
┌────────────────────────────────────────────────────────────────┐
│                      Security Layers                            │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 🔐 HTTPS (Transport Layer)                                 │
│     └─ Encrypts all data in transit                            │
│                                                                 │
│  2. 🔑 JWT Tokens (Authentication Layer)                       │
│     ├─ Access Token (short-lived)                              │
│     └─ Refresh Token (longer-lived)                            │
│                                                                 │
│  3. 🚪 Auth Guard (Route Protection)                           │
│     └─ Prevents unauthorized access to protected routes        │
│                                                                 │
│  4. 🔒 HTTP Interceptor (Request Protection)                   │
│     ├─ Adds tokens to requests                                 │
│     └─ Handles token refresh                                   │
│                                                                 │
│  5. 🗝️ Password Hashing (Backend)                             │
│     └─ bcrypt for secure password storage                      │
│                                                                 │
│  6. ⏱️ Token Expiration                                        │
│     ├─ Access: 15 minutes                                      │
│     └─ Refresh: 7 days                                         │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

This architecture provides a complete, production-ready authentication system! 🚀
