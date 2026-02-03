export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    username: string;
    fullName: string;
  };
  meta: {
    timestamp: number;
    date: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
  meta: {
    timestamp: number;
    date: string;
  };
}

export interface UserInfo {
  userId: string;
  username: string;
  fullName: string;
}
