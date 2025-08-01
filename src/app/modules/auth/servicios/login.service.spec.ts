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

  it('should make HTTP POST request for login', () => {
    const mockUser = { username: 'testuser', password: 'testpassword' };
    const mockResponse = { token: 'mock-token' };

    // Don't subscribe to avoid executing the tap operator which causes page reload
    const observable = service.iniciarSesion(mockUser.username, mockUser.password);

    // Verify the observable was created
    expect(observable).toBeDefined();

    // Expect the login request to be made when subscribed
    observable.subscribe({
      error: () => {
        // Ignore errors since we're only testing the HTTP call structure
      },
    });

    const loginReq = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(loginReq.request.method).toBe('POST');
    expect(loginReq.request.body).toEqual(mockUser);

    // Don't flush the response to avoid executing the tap callback
    loginReq.error(new ErrorEvent('Test error'));
  });

  it('should log out user and remove data from localStorage', () => {
    spyOn(router, 'navigate');

    service.cerrarSesion();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('usuario');
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
