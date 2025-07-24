import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { validateTokenGuard } from './validate-token.guard';
import { UsuarioService } from '../../modules/auth/servicios/usuario.service';
import { Login } from '../../modules/auth/interfaces/usuario.interface';

describe('validateTokenGuard', () => {
  let usuarioService: UsuarioService;

  const executeGuard: CanActivateChildFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => validateTokenGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsuarioService],
    });
    usuarioService = TestBed.inject(UsuarioService);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true when user is authenticated', () => {
    // Arrange: crear mocks para los parámetros del guard
    const childRouteMock = {} as ActivatedRouteSnapshot;
    const stateMock = {} as RouterStateSnapshot;

    // Set up a mock user to simulate authentication
    const mockUser: Login = {
      token: 'mock-token',
      user: {
        firstname: 'Test',
        role: 'admin',
        userId: '123',
        sub: 'testuser',
        iat: 0,
        exp: 0,
        activityStatus: 'active',
        username: 'testuser',
      },
    };
    usuarioService.usuario = mockUser;

    // Act: ejecutar el guard con los parámetros de prueba
    const result = executeGuard(childRouteMock, stateMock);

    // Assert: verificar que el resultado sea true
    expect(result).toBe(true);
  });

  it('should return false when user is not authenticated', () => {
    // Arrange: crear mocks para los parámetros del guard
    const childRouteMock = {} as ActivatedRouteSnapshot;
    const stateMock = {} as RouterStateSnapshot;

    // Ensure no user is set (unauthenticated state)
    usuarioService.usuario = undefined as any;

    // Act: ejecutar el guard con los parámetros de prueba
    const result = executeGuard(childRouteMock, stateMock);

    // Assert: verificar que el resultado sea false
    expect(result).toBe(false);
  });
});
