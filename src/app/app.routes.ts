import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // 🔐 LOGIN (público)
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },

  // 🔒 ÁREA PRIVADA
  {
    path: '',
    canActivate: [AuthGuard],
    children: [

      // Dashboard → solo requiere token
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },

      // 🔒 USUARIOS → SOLO ADMIN
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin','visor'] }
      },

      
       {
        path: 'categorias',
        loadComponent: () =>
          import('./pages/categoria/categoria.component').then(m => m.CategoriasComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin','visor'] }
      },
       {
        path: 'proveedores',
        loadComponent: () =>
          import('./pages/proveedores/proveedores.component').then(m => m.ProveedoresComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin','visor'] }
      },
 {
        path: 'productos',
        loadComponent: () =>
          import('./pages/producto/producto.component').then(m => m.ProductosComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin','visor','empleado'] }
      },
       {
        path: 'movimientos',
        loadComponent: () =>
          import('./pages/movimiento/movimiento.component').then(m => m.MovimientosComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin','visor','empleado'] }
      },
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
