import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UsuarioService } from './usuario.service';
import { CustomJwtPayload, Login } from '../interfaces/usuario.interface';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private usuarioService: UsuarioService,
  ) {}

  iniciarSesion(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        const payload = this.getTokenPayload();
        if (payload) {
          const login: Login = {
            token: res.token,
            user: {
              firstname: payload.firstname || '',
              role: payload.role || '',
              userId: payload.userId || '',
              sub: payload.sub || '',
              iat: payload.iat || 0,
              exp: payload.exp || 0,
            },
          };
          localStorage.setItem('usuario', JSON.stringify(payload.sub));
          localStorage.setItem('firstname', JSON.stringify(payload.firstname));
          this.usuarioService.usuario = login;
          this.router.navigate(['/home']);
        }
      }),
    );
  }

  getTokenPayload(): CustomJwtPayload | null {
    const token = localStorage.getItem('token');
    if (token) {
      return jwtDecode<CustomJwtPayload>(token);
    }
    return null;
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/auth/login']);
  }
}
