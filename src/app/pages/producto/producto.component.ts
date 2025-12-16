import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AfterViewInit } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { ProveedorService, Proveedor } from '../../services/proveedor.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './producto.component.html'
})

export class ProductosComponent implements OnInit, AfterViewInit {

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];
modalConfirmarEliminar = false;
productoAEliminar: Producto | null = null;
alertaVisible = false;
alertaMensaje = '';
alertaTipo: 'success' | 'error' | 'warning' = 'success';
  modalAbierto = false;
  editando = false;
  puedeEditar = false;

  producto: Producto = this.nuevoProducto();

  filtroNombre = '';
filtroCategoria: number | null = null;
filtroProveedor: number | null = null;

productosFiltrados: Producto[] = [];

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private auth: AuthService
  ) {}

  ngOnInit() {
  
    
    this.cargarProductos();
    this.cargarAuxiliares();
    
  }
    ngAfterViewInit() {
    const rol = this.auth.getrole();
    console.log('ROL:', rol);

    this.puedeEditar = rol === 'admin' || rol === 'empleado';
  }
  abrirConfirmacionEliminar(producto: Producto) {
  this.productoAEliminar = producto;
  this.modalConfirmarEliminar = true;
}
mostrarAlerta(mensaje: string, tipo: 'success' | 'error' | 'warning' = 'success') {
  this.alertaMensaje = mensaje;
  this.alertaTipo = tipo;
  this.alertaVisible = true;

  setTimeout(() => {
    this.alertaVisible = false;
  }, 3500);
}

cancelarEliminar() {
  this.modalConfirmarEliminar = false;
  this.productoAEliminar = null;
}
confirmarEliminar() {
  if (!this.productoAEliminar) return;

  this.productoService.delete(this.productoAEliminar.id!).subscribe({
    next: () => {
      this.cargarProductos();
      this.cancelarEliminar();
      this.mostrarAlerta('Producto eliminado correctamente', 'success');
    },
    error: err => {
      if (err.status === 422) {
        this.mostrarAlerta(err.error?.message || 'No se puede eliminar el producto', 'warning');
      } else {
        this.mostrarAlerta('Error al eliminar el producto', 'error');
        console.error(err);
      }
      this.cancelarEliminar();
    }
  });
}


  aplicarFiltros() {
  this.productosFiltrados = this.productos.filter(p => {

    const coincideNombre =
      !this.filtroNombre ||
      p.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase());

    const coincideCategoria =
      !this.filtroCategoria ||
      p.categoria_id === this.filtroCategoria;

    const coincideProveedor =
      !this.filtroProveedor ||
      p.proveedor_id === this.filtroProveedor;

    return coincideNombre && coincideCategoria && coincideProveedor;
  });
}


  nuevoProducto(): Producto {
    return {
       codigo: '',
  nombre: '',
  descripcion: '',
  categoria_id: 0,
  proveedor_id: undefined,
  precio_costo: 0,
  precio_venta: 0,
  stock: 0,
  stock_minimo: 0
    };
  }

 cargarProductos() {
  this.productoService.getAll().subscribe(res => {
    this.productos = res.data;
    this.aplicarFiltros();
  });
}

  cargarAuxiliares() {
    this.categoriaService.getAll().subscribe(res => this.categorias = res.data);
    this.proveedorService.getAll().subscribe(res => this.proveedores = res.data);
  }

  abrirNuevo() {
    this.producto = this.nuevoProducto();
    this.editando = false;
    this.modalAbierto = true;
  }

  abrirEditar(p: Producto) {
    this.producto = { ...p };
    this.editando = true;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardar() {
  if (!this.producto.codigo || !this.producto.nombre || !this.producto.categoria_id) {
    alert('Complete los campos obligatorios');
    return;
  }

  if (this.editando) {
    this.productoService.update(this.producto.id!, this.producto).subscribe(() => {
      this.cerrarModal();
      this.cargarProductos();
    });
  } else {
    this.productoService.create(this.producto).subscribe(() => {
      this.cerrarModal();
      this.cargarProductos();
    });
  }
}

 

}
