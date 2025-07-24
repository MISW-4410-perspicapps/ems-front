import { CanActivateChildFn } from '@angular/router';
import { inject } from '@angular/core';
import { UsuarioService } from '../../modules/auth/servicios/usuario.service';

export const validateTokenGuard: CanActivateChildFn = (childRoute, state) => {
  const usuarioService = inject(UsuarioService);
  const user = usuarioService.usuario;
  return !!user;
};
