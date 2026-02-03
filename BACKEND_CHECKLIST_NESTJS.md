# NestJS Backend Implementation Checklist

## 📋 Required Endpoints for Frontend Integration

This checklist helps you ensure your NestJS backend is properly configured to work with the Angular frontend authentication system.

## 🎯 Required Dependencies

Install these NestJS packages:

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @nestjs/config
npm install bcrypt
npm install --save-dev @types/passport-jwt @types/bcrypt
```

## 📝 Implementation Checklist

### 1. ✅ Login Endpoint

```typescript
// auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.validateUser(
      loginDto.username, 
      loginDto.password
    );
    
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(result);
  }
}
```

**DTO (Data Transfer Object):**

```typescript
// dto/login.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

**Expected Response Format:**

```typescript
{
  "data": {
    "accessToken": "jwt-access-token-here",
    "refreshToken": "jwt-refresh-token-here",
    "userId": "user-uuid",
    "username": "janedoe",
    "fullName": "Jane Doe"
  },
  "meta": {
    "timestamp": Date.now(),
    "date": new Date().toISOString()
  }
}
```

### 2. ✅ Refresh Token Endpoint

```typescript
// auth.controller.ts
@Post('refresh-token')
@HttpCode(HttpStatus.OK)
async refreshToken(@Body() refreshDto: RefreshTokenDto) {
  try {
    const tokens = await this.authService.refreshTokens(
      refreshDto.refreshToken
    );
    
    return {
      data: tokens,
      meta: {
        timestamp: Date.now(),
        date: new Date().toISOString()
      }
    };
  } catch (error) {
    throw new UnauthorizedException('Invalid refresh token');
  }
}
```

**DTO:**

```typescript
// dto/refresh-token.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
```

**Expected Response:**

```typescript
{
  "data": {
    "accessToken": "new-jwt-access-token",
    "refreshToken": "new-jwt-refresh-token"
  },
  "meta": {
    "timestamp": Date.now(),
    "date": new Date().toISOString()
  }
}
```

### 3. ✅ Auth Service Implementation

```typescript
// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    // Add your UserService here
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // Find user by username
    const user = await this.userService.findByUsername(username);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      username: user.username, 
      sub: user.id,
      userId: user.id 
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m', // 15 minutes
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d', // 7 days
    });

    // Store refresh token in database (recommended)
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      data: {
        accessToken,
        refreshToken,
        userId: user.id,
        username: user.username,
        fullName: user.fullName || `${user.firstName} ${user.lastName}`,
      },
      meta: {
        timestamp: Date.now(),
        date: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(',', '')
      }
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Verify refresh token exists in database
      const isValid = await this.verifyRefreshToken(
        payload.userId, 
        refreshToken
      );

      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const newPayload = { 
        username: payload.username, 
        sub: payload.sub,
        userId: payload.userId 
      };

      const accessToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '15m',
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      });

      // Update refresh token in database
      await this.saveRefreshToken(payload.userId, newRefreshToken);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async saveRefreshToken(userId: string, token: string) {
    // Store refresh token in database with user ID
    // This allows you to revoke tokens if needed
    // Example: await this.refreshTokenRepo.save({ userId, token });
  }

  private async verifyRefreshToken(userId: string, token: string): Promise<boolean> {
    // Check if refresh token exists in database
    // Example: const exists = await this.refreshTokenRepo.findOne({ userId, token });
    // return !!exists;
    return true; // Implement actual verification
  }
}
```

### 4. ✅ JWT Strategy (for Protected Routes)

```typescript
// strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      username: payload.username 
    };
  }
}
```

### 5. ✅ JWT Auth Guard

```typescript
// guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### 6. ✅ Module Configuration

```typescript
// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### 7. ✅ Environment Variables

Create `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-too

# Token Expiration
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Database (example)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=moein_db
```

### 8. ✅ CORS Configuration

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4300'], // Your frontend URLs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(3000);
}
bootstrap();
```

### 9. ✅ Protect Routes Example

```typescript
// users.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  
  @Get('profile')
  @UseGuards(JwtAuthGuard) // Protected route
  getProfile(@Request() req) {
    return {
      data: req.user,
      meta: {
        timestamp: Date.now(),
        date: new Date().toISOString()
      }
    };
  }
}
```

### 10. ✅ User Entity Example (TypeORM)

```typescript
// entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // Store hashed password

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 11. ✅ Password Hashing

```typescript
// user.service.ts
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  async create(username: string, password: string, fullName: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      fullName,
    });

    return this.userRepository.save(user);
  }
}
```

## 🧪 Testing Your Backend

### Test Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"janedoe","password":"password123"}'
```

### Test Refresh Token:
```bash
curl -X POST http://localhost:3000/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"your-refresh-token-here"}'
```

### Test Protected Route:
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer your-access-token-here"
```

## ✅ Final Checklist

Before connecting to frontend:

- [ ] `/auth/login` endpoint returns correct format
- [ ] `/auth/refresh-token` endpoint works
- [ ] JWT tokens are properly generated
- [ ] Access token expires in 15 minutes
- [ ] Refresh token expires in 7 days
- [ ] CORS is enabled for frontend URL
- [ ] Passwords are hashed with bcrypt
- [ ] Protected routes use `@UseGuards(JwtAuthGuard)`
- [ ] Refresh tokens are stored in database
- [ ] Environment variables are configured
- [ ] Validation pipes are enabled

## 🔐 Security Best Practices

1. **Never commit secrets:** Use `.env` and add to `.gitignore`
2. **Strong secrets:** Use long random strings for JWT secrets
3. **Hash passwords:** Always use bcrypt (never store plain text)
4. **Store refresh tokens:** Keep them in database for revocation
5. **HTTPS in production:** Always use HTTPS
6. **Rate limiting:** Add rate limiting to login endpoint
7. **Token rotation:** Rotate refresh tokens on each use
8. **Expiration times:** Short for access (15m), longer for refresh (7d)

## 🚀 You're Ready!

Once all items are checked, your backend is ready to work with the Angular frontend! 🎉
