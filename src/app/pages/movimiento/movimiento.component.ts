import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovimientoService, Movimiento } from '../../services/movimiento.service';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProductoService, Producto } from '../../services/producto.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './movimiento.component.html'
})
export class MovimientosComponent implements OnInit {

  movimientos: Movimiento[] = [];
  puedeEditar = false;
  modalAbierto = false;
productos: Producto[] = [];
  movimiento: Movimiento = this.movimientoVacio();

movimientosFiltrados: Movimiento[] = [];
usuarios: { id: number; nombre: string }[] = [];
filtroProducto: number | null = null;
filtroUsuario: number | null = null;
fechaDesde: string | null = null;
fechaHasta: string | null = null;

  constructor(
    private movimientoService: MovimientoService,
    private auth: AuthService,
     private productoService: ProductoService,
     private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
  const rol = this.auth.getrole();
  this.puedeEditar = rol === 'admin' || rol === 'empleado';

  this.cargar();

  this.cargarProductos();
    this.cargarUsuarios();
  console.log(this.movimientos);
}
cargarProductos() {
  this.productoService.getAll().subscribe({
    next: res => this.productos = res.data ?? res,
    error: err => console.error(err)
  });
}
cargarUsuarios() {
  this.usuarioService.getAll().subscribe({
    next: res => this.usuarios = res.data ?? res,
    error: err => console.error(err)
  });
}
cargar() {
  this.movimientoService.getAll().subscribe({
    next: res => {
      this.movimientos = res.data;
      this.movimientosFiltrados = [...this.movimientos];
    },
    error: err => console.error(err)
  });
}

aplicarFiltros() {
  this.movimientosFiltrados = this.movimientos.filter(m => {

    if (this.filtroProducto && m.producto_id !== this.filtroProducto) {
      return false;
    }

    if (this.filtroUsuario && m.usuario_id !== this.filtroUsuario) {
      return false;
    }

    if (this.fechaDesde) {
      const fechaMov = new Date(m.fecha!);
      const desde = new Date(this.fechaDesde);
      if (fechaMov < desde) return false;
    }

    if (this.fechaHasta) {
      const fechaMov = new Date(m.fecha!);
      const hasta = new Date(this.fechaHasta);
      hasta.setHours(23, 59, 59);
      if (fechaMov > hasta) return false;
    }

    return true;
  });
}

  abrirNuevo() {
    const user = localStorage.getItem('user');
    if (!user) return;

    const usuario = JSON.parse(user);

    this.movimiento = {
      ...this.movimientoVacio(),
      usuario_id: usuario.id
    };

    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

guardarMovimiento() {

  if (
    !this.movimiento.producto_id ||
    !this.movimiento.usuario_id ||
    this.movimiento.cantidad <= 0
  ) {
    alert('Completa todos los campos obligatorios');
    return;
  }

  this.movimientoService.create(this.movimiento).subscribe({
    next: () => {
      this.modalAbierto = false;
      this.cargar();
    },
    error: err => {
      console.error(err.error);
      alert(err.error?.message || 'Error al crear movimiento');
    }
  });
}



  private movimientoVacio(): Movimiento {
    return {
      producto_id: null,
      tipo: 'entrada',
      cantidad: 1,
      motivo: '',
      usuario_id: null
    };
  }
}
