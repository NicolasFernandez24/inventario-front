import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProveedorService, Proveedor } from '../../services/proveedor.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './proveedores.component.html'
})
export class ProveedoresComponent implements OnInit {

  proveedores: Proveedor[] = [];
busqueda: string = '';
  modalAbierto = false;
  editando = false;
rol: string = '';
  proveedor: Proveedor = { id: 0, nombre: '', telefono: '', email: '', direccion: '' };
modalConfirmarEliminar = false;
proveedorAEliminar: Proveedor | null = null;
alertaVisible = false;
alertaMensaje = '';
alertaTipo: 'success' | 'error' | 'warning' = 'success';
  constructor(private proveedorService: ProveedorService) {}

  ngOnInit() {
       const usuario = localStorage.getItem('user')
  if (usuario) {
    this.rol = JSON.parse(usuario).role;
  }
    this.cargar();
  }

  cargar() {
    this.proveedorService.getAll().subscribe({
      next: res => {
        
        this.proveedores = res.data;
      },
      error: err => console.error("Error al cargar proveedores", err)
    });
  }
  get proveedoresFiltrados() {
  return this.proveedores.filter(p =>
    p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
  );
}
mostrarAlerta(mensaje: string, tipo: 'success' | 'error' | 'warning' = 'success') {
  this.alertaMensaje = mensaje;
  this.alertaTipo = tipo;
  this.alertaVisible = true;

  setTimeout(() => {
    this.alertaVisible = false;
  }, 3500);
}
  abrirModalNuevo() {
    this.proveedor = { id: 0, nombre: '', telefono: '', email: '', direccion: '' };
    this.editando = false;
    this.modalAbierto = true;
  }

  abrirModalEditar(p: Proveedor) {
    this.proveedor = { ...p };
    this.editando = true;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardar() {
    if (!this.proveedor.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    if (this.editando) {
      this.proveedorService.update(this.proveedor.id, this.proveedor).subscribe(() => {
        this.cerrarModal();
        this.cargar();
      });
    } else {
      this.proveedorService.create(this.proveedor).subscribe(() => {
        this.cerrarModal();
        this.cargar();
      });
    }
  }


    abrirConfirmacionEliminar(producto: Proveedor) {
    this.proveedorAEliminar = producto;
    this.modalConfirmarEliminar = true;
  }
  cancelarEliminar() {
    this.modalConfirmarEliminar = false;
    this.proveedorAEliminar = null;
  }
  confirmarEliminar() {
    if (!this.proveedorAEliminar) return;
  
    this.proveedorService.delete(this.proveedorAEliminar.id!).subscribe({
      next: () => {
        this.cargar();
        this.cancelarEliminar();
         this.mostrarAlerta('Proveedor eliminado correctamente', 'success');
      },
      error: err => {
        if (err.status === 422) {
        this.mostrarAlerta(err.error?.message || 'No se puede eliminar el proveedor', 'warning');
      } else {
           this.mostrarAlerta('Error al eliminar el proveedor', 'error');
          console.error(err);
        }
        this.cancelarEliminar();
      }
    });
}
 }
