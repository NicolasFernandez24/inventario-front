import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

type Role = 'admin' | 'empleado' | 'visor';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  user: any = null;
  role: Role = 'visor';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.loadUser();
  }

  loadUser() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.role = this.user.role as Role;
    } else {
      this.router.navigate(['/login']);
    }
  }

  hasPermission(module: string): boolean {
    const permissions: Record<Role, string[]> = {
      admin: ['productos', 'categorias', 'proveedores', 'movimientos', 'usuarios'],
      empleado: ['productos', 'movimientos'],
      visor: ['productos', 'movimientos', 'proveedores', 'movimientos','usuarios'],
    };

    return permissions[this.role]?.includes(module) ?? false;
  }

  navigate(path: string) {
    if (this.hasPermission(path)) {
      this.router.navigate([path]);
    }
  }

  logout() {
    this.auth.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
