import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const RoleGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Decodificar JWT sin librerías
  const payload = JSON.parse(atob(token.split('.')[1]));
  const userRole = payload.rol;

  const allowedRoles = route.data?.['roles'] as string[];

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
