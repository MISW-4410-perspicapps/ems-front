import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';

import { LoginService } from './login.service';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  let router: Router;
  let originalLocalStorage: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
  };

  // Guarda las referencias originales antes de modificarlas
  beforeAll(() => {
    originalLocalStorage = {
      getItem: () => null,
      setItem: (key: string, value: string) => {
        console.log(`setItem called with key: ${key}, value: ${value}`);
      },
      removeItem: (key: string) => {
        console.log(`removeItem called with key: ${key}`);
      },
    };
    originalLocalStorage.getItem = localStorage.getItem;
    originalLocalStorage.setItem = localStorage.setItem;
    originalLocalStorage.removeItem = localStorage.removeItem;
  });

  // Restaura las funciones originales después de todas las pruebas
  afterAll(() => {
    localStorage.getItem = originalLocalStorage.getItem;
    localStorage.setItem = originalLocalStorage.setItem;
    localStorage.removeItem = originalLocalStorage.removeItem;
  });

  beforeEach(() => {
    // Crear mocks nuevos para cada prueba
    const getItemSpy = jasmine.createSpy('getItem');
    const setItemSpy = jasmine.createSpy('setItem');
    const removeItemSpy = jasmine.createSpy('removeItem');

    // Asignar los spies directamente sin usar spyOn()
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: getItemSpy,
        setItem: setItemSpy,
        removeItem: removeItemSpy,
      },
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [LoginService, provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in user and save data to localStorage', () => {
    const mockUser = { username: 'testuser', password: 'testpassword' };
    const mockResponse = {
      token: 'e77c0b8a-a7b9-4c31-a524-a7c32e87b248',
    };

    const mockPayload = {
      firstname: 'Esteban Bins',
      role: 'STAFF',
      userId: '253e3e87-1981-4197-a140-eddb470b00af',
      sub: '253e3e87-1981-4197-a140-eddb470b00af',
      iat: 1642694400,
      exp: 1642780800,
      activityStatus: 'active',
      username: 'Esteban.Bins',
    };

    const mockLegacyResponse = { status: 'success', data: 'legacy login successful' };

    // Mock jwtDecode
    spyOn(service, 'getTokenPayload').and.returnValue(mockPayload);
    spyOn(router, 'navigate');

    service.iniciarSesion(mockUser.username, mockUser.password).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', mockResponse.token);
      expect(localStorage.setItem).toHaveBeenCalledWith('usuario', JSON.stringify(mockPayload.sub));
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'firstname',
        JSON.stringify(mockPayload.firstname),
      );
    });

    // Expect the login request
    const loginReq = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(loginReq.request.method).toBe('POST');
    expect(loginReq.request.body).toEqual(mockUser);
    loginReq.flush(mockResponse);

    // Expect the legacy login request
    const legacyReq = httpMock.expectOne(`${environment.apiUrl}/api/legacy/dashboard`);
    expect(legacyReq.request.method).toBe('GET');
    legacyReq.flush(mockLegacyResponse);
  });

  it('should log out user and remove data from localStorage', () => {
    spyOn(router, 'navigate');

    service.cerrarSesion();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('usuario');
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should test llamarLegacyLogin method independently', () => {
    const mockLegacyResponse = { status: 'success', data: 'legacy login successful' };

    service.llamarLegacyLogin().subscribe(response => {
      expect(response).toEqual(mockLegacyResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/legacy/dashboard`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLegacyResponse);
  });

  it('should call legacy login after successful login and navigate on success', () => {
    const mockUser = { username: 'testuser', password: 'testpassword' };
    const mockResponse = { token: 'test-token' };
    const mockPayload = {
      firstname: 'Test User',
      role: 'STAFF',
      userId: 'test-id',
      sub: 'test-sub',
      iat: 1642694400,
      exp: 1642780800,
      activityStatus: 'active',
      username: 'testuser',
    };
    const mockLegacyResponse = { status: 'success' };

    spyOn(service, 'getTokenPayload').and.returnValue(mockPayload);
    spyOn(router, 'navigate');

    // Subscribe to the login service
    service.iniciarSesion(mockUser.username, mockUser.password).subscribe();

    // Handle the auth login request
    const authReq = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    authReq.flush(mockResponse);

    // Handle the legacy login request
    const legacyReq = httpMock.expectOne(`${environment.apiUrl}/api/legacy/dashboard`);
    legacyReq.flush(mockLegacyResponse);

    // Verify both requests were made
    expect(authReq.request.method).toBe('POST');
    expect(legacyReq.request.method).toBe('GET');
  });

  it('should navigate to login on legacy login error', () => {
    const mockUser = { username: 'testuser', password: 'testpassword' };
    const mockResponse = { token: 'test-token' };
    const mockPayload = {
      firstname: 'Test User',
      role: 'STAFF',
      userId: 'test-id',
      sub: 'test-sub',
      iat: 1642694400,
      exp: 1642780800,
      activityStatus: 'active',
      username: 'testuser',
    };

    spyOn(service, 'getTokenPayload').and.returnValue(mockPayload);
    spyOn(router, 'navigate');
    spyOn(console, 'error');

    // Subscribe to the login service
    service.iniciarSesion(mockUser.username, mockUser.password).subscribe();

    // Handle the auth login request
    const authReq = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    authReq.flush(mockResponse);

    // Handle the legacy login request with error
    const legacyReq = httpMock.expectOne(`${environment.apiUrl}/api/legacy/dashboard`);
    legacyReq.error(new ErrorEvent('Network error'), { status: 500 });

    // Verify both requests were made
    expect(authReq.request.method).toBe('POST');
    expect(legacyReq.request.method).toBe('GET');
  });
});
