import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LocalizationService } from './shared/servicios/localization.service';
import { UsuarioService } from './modules/auth/servicios/usuario.service';
import { LoginService } from './modules/auth/servicios/login.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private localizationService: LocalizationService,
    private usuarioService: UsuarioService,
    private loginService: LoginService,
  ) {}
  title = 'ccp-project';

  ngOnInit() {
    this.loginService.inicializarUsuarioToken();
  }
}
