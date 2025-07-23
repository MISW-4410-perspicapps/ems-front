import { TestBed } from '@angular/core/testing';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let originalLocalStorage: Storage;

  const mockUser = {
    token: 'e77c0b8a-a7b9-4c31-a524-a7c32e87b248',
    user: {
      firstname: 'Esteban Bins',
      role: 'STAFF',
      userId: '253e3e87-1981-4197-a140-eddb470b00af',
      sub: '253e3e87-1981-4197-a140-eddb470b00af',
      iat: 1642694400,
      exp: 1642780800,
    },
  };

  beforeEach(() => {
    // Guardar referencia al localStorage original
    originalLocalStorage = window.localStorage;

    // Mock del localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jasmine.createSpy('getItem').and.returnValue(null),
        setItem: jasmine.createSpy('setItem'),
        removeItem: jasmine.createSpy('removeItem'),
        clear: jasmine.createSpy('clear'),
        key: jasmine.createSpy('key'),
        length: 0,
      },
      writable: true,
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioService);
  });

  afterEach(() => {
    // Restaurar el localStorage original
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get usuario and get user corrrectly', () => {
    service.usuario = mockUser;
    const user = service.usuario;
    expect(user).toEqual(mockUser);
    expect(user!.token).toEqual('e77c0b8a-a7b9-4c31-a524-a7c32e87b248');
    expect(user!.user.firstname).toEqual('Esteban Bins');
    expect(user!.user.role).toEqual('STAFF');
    expect(user!.user.userId).toEqual('253e3e87-1981-4197-a140-eddb470b00af');
  });

  it('should call set usuario and set user correctly', () => {
    service.usuario = mockUser;
    const user = service.usuario;
    expect(user).toEqual(mockUser);
  });

  it('should call get token and get token correctly', () => {
    service.usuario = mockUser;
    localStorage.getItem = jasmine.createSpy('getItem').and.returnValue(null);
    const token = service.token;
    expect(token).toEqual('e77c0b8a-a7b9-4c31-a524-a7c32e87b248');
  });

  it('should call token and get "" when user dont exist', () => {
    localStorage.getItem = jasmine.createSpy('getItem').and.returnValue(null);
    const token = service.token;
    expect(token).toEqual('');
  });

  it('should return token from localStorage when it exists', () => {
    const tokenValue = 'token-from-localStorage';
    localStorage.getItem = jasmine.createSpy('getItem').and.returnValue(tokenValue);

    const token = service.token;

    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(token).toEqual(tokenValue);
  });
});
