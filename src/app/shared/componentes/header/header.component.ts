import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../modules/auth/servicios/usuario.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userFirstname: string | undefined;

  constructor(private readonly usuarioService: UsuarioService) {}

  ngOnInit(): void {
    console.log('firstname', this.usuarioService.usuario);
    this.userFirstname = this.usuarioService.usuario?.user?.firstname;
  }
}
