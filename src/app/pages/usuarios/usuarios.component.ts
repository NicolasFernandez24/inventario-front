import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';

type Role = 'admin' | 'empleado' | 'visor';
@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule,SidebarComponent],
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];
  loading = true;
  user: any = null;
    role: Role = 'visor';
searchTerm: string = '';
usuariosFiltrados: any[] = [];
modalAbierto = false;
editando = false;
modalConfirmarEliminar = false;
usuarioAEliminar: any = null;
alertaTipo: 'success' | 'error' | 'warning' = 'success';
alertaVisible = false;
alertaMensaje = '';
usuario: any = {
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  password: '',
  rol: 'empleado'
};
  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.role = this.user.role;
    this.loadUsuarios();
  }
abrirNuevo() {
  this.editando = false;
  this.usuario = {
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    password: '',
    rol: 'empleado'
  };
  this.modalAbierto = true;
}
abrirEditar(u: any) {
  this.editando = true;
  this.usuario = { ...u, password: '' }; 
  this.modalAbierto = true;
}
cerrarModal() {
  this.modalAbierto = false;
}

  loadUsuarios() {
  this.usuarioService.getAll().subscribe({
    next: (res) => {
      this.usuarios = res.data || [];
      this.usuariosFiltrados = [...this.usuarios];
      this.loading = false;
    }
  });
}
filtrarUsuarios() {
  const term = this.searchTerm.toLowerCase().trim();

  this.usuariosFiltrados = this.usuarios.filter(u =>
    u.nombre.toLowerCase().includes(term) ||
    u.apellido.toLowerCase().includes(term)
  );
}
  puedeEditar() {
    return this.role === 'admin';
  }
guardar() {
  if (!this.usuario.nombre || !this.usuario.apellido || !this.usuario.email) {
    alert('Datos incompletos');
    return;
  }

  if (this.editando) {
    this.usuarioService.update(this.usuario.id, this.usuario).subscribe(() => {
      this.loadUsuarios();
      this.cerrarModal();
    });
  } else {
    this.usuarioService.create(this.usuario).subscribe(() => {
      this.loadUsuarios();
      this.cerrarModal();
    });
  }
}

  crearUsuario() {
    if (!this.puedeEditar()) return;
    this.router.navigate(['/usuarios/form']);
  }

  editarUsuario(id: number) {
    if (!this.puedeEditar()) return;
    this.router.navigate(['/usuarios/form', id]);
  }

abrirConfirmacionEliminar(usuario: any) {
  if (!this.puedeEditar()) return;

  this.usuarioAEliminar = usuario;
  this.modalConfirmarEliminar = true;
}
cancelarEliminar() {
  this.modalConfirmarEliminar = false;
  this.usuarioAEliminar = null;
}
confirmarEliminar() {
  if (!this.usuarioAEliminar) return;

  this.usuarioService.delete(this.usuarioAEliminar.id).subscribe({
    next: () => {
      this.loadUsuarios();
      this.cancelarEliminar();
       this.mostrarAlerta('Usuario eliminado correctamente', 'success');
    },
    error: err => {
  
       this.mostrarAlerta(err.error?.message || 'No se puede eliminar el usuario', 'warning');
      console.error(err);
      this.cancelarEliminar();
    }
  });
}

mostrarAlerta(mensaje: string, tipo: 'success' | 'error' | 'warning' = 'success') {
  this.alertaMensaje = mensaje;
  this.alertaTipo = tipo;
  this.alertaVisible = true;
 }

  logout() {
    this.auth.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
