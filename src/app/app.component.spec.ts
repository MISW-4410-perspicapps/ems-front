import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';
import { LocalizationService } from './shared/servicios/localization.service';
import { UsuarioService } from './modules/auth/servicios/usuario.service';
import { LoginService } from './modules/auth/servicios/login.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

class MockLocalizationService {
  currentLocalizationSubject = new BehaviorSubject<Record<string, string>>({});
  currentLocalization$ = this.currentLocalizationSubject.asObservable();
  currentLang$ = new BehaviorSubject<string>('es').asObservable();
  localeId = 'es-ES';
  currentLocale$ = new BehaviorSubject<string>('es-ES');

  getLocale() {
    return 'es-ES';
  }
  getLang() {
    return 'es';
  }
  getCurrencyCode() {
    return 'EUR';
  }
}

class MockLoginService {
  inicializarUsuarioToken() {
    // Mock implementation
  }
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: LocalizationService, useClass: MockLocalizationService },
        { provide: LoginService, useClass: MockLoginService },
        UsuarioService,
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have title "ccp-project"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ccp-project');
  });

  it('should call inicializarUsuarioToken on ngOnInit', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const loginService = TestBed.inject(LoginService);
    const spy = spyOn(loginService, 'inicializarUsuarioToken');

    app.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });
});
