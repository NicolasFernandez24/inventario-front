import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';

type Role = 'admin' | 'empleado' | 'visor';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  role: Role = 'visor';
  user: any = null;

  productosStockBajo: any[] = [];
  mostrarAlertas = false;

  constructor(
    private router: Router,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.role = this.user.role as Role;

    
      if (this.role === 'admin') {
        this.cargarAlertasStock();
      }

    } else {
      this.router.navigate(['/login']);
    }
  }

  cargarAlertasStock() {
    this.productoService.getStockBajo().subscribe({
      next: res => {
        this.productosStockBajo = res.data || [];
      },
      error: err => console.error('Error stock bajo', err)
    });
  }

  toggleAlertas() {
    this.mostrarAlertas = !this.mostrarAlertas;
  }

  hasPermission(module: string): boolean {
    const permissions: Record<Role, string[]> = {
      admin: ['productos', 'categorias', 'proveedores', 'movimientos', 'usuarios'],
      empleado: ['productos', 'movimientos'],
      visor: ['productos', 'proveedores','usuarios'],
    };

    return permissions[this.role]?.includes(module) ?? false;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
