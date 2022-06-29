export interface LoginContext {
  username: string;
  password: string;
  otp: string;
  remember?: boolean;
}

export interface RegisterContext {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthorizationEntity {
  username?: string;
  authorized: boolean;
  email: string;
  fullName: string;
  expiresIn: Date | string;
  accessToken: string;
  admin: boolean;
  newUser: boolean;
  remember?: boolean;
}
