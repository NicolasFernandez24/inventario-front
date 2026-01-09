import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './categoria.component.html'
})
export class CategoriasComponent implements OnInit {

  categorias: Categoria[] = [];
rol: string = '';
  modalAbierto = false;
  editando = false;
busqueda: string = '';
  categoria: Categoria = { id: 0, nombre: '' };

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit() {
      const usuario = localStorage.getItem('user')
  if (usuario) {
    this.rol = JSON.parse(usuario).role;
  }

    this.cargar();
  }

cargar() {
  this.categoriaService.getAll().subscribe({
    next: res => {
     
      this.categorias = res.data;  
    },
    error: err => console.error("Error al cargar categorías", err)
  });
}
get categoriasFiltradas() {
  return this.categorias.filter(c =>
    c.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
  );
}

  abrirModalNueva() {
    this.categoria = { id: 0, nombre: '' };
    this.editando = false;
    this.modalAbierto = true;
  }

  abrirModalEditar(cat: Categoria) {
    this.categoria = { ...cat };
    this.editando = true;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardar() {
    if (!this.categoria.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    if (this.editando) {
      this.categoriaService.update(this.categoria.id, this.categoria).subscribe(() => {
        this.cerrarModal();
        this.cargar();
      });
    } else {
      this.categoriaService.create(this.categoria).subscribe(() => {
        this.cerrarModal();
        this.cargar();
      });
    }
  }

  eliminar(id: number) {
    if (!confirm("¿Eliminar categoría?")) return;
    this.categoriaService.delete(id).subscribe(() => this.cargar());
  }
}
