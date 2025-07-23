import { JwtPayload } from 'jwt-decode';

export interface Usuario {
  usuario: string;
  nombres: string;
  apellidos: string;
  fullName: string;
}

export interface Login {
  token: string;
  user: User;
}

export interface User {
  firstname: string;
  role: string;
  userId: string;
  activityStatus: string;
  username: string;
  sub: string;
  iat: number;
  exp: number;
}

export interface CustomJwtPayload extends Omit<JwtPayload, 'exp' | 'iat' | 'sub'>, User {}
