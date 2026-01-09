import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = '';
  password = '';
  error = '';
  loading = false;
  year = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
  this.loading = true;
  this.error = '';

  this.authService.login({ email: this.email, password: this.password })
    .subscribe({
      
     next: (res: any) => {

  localStorage.setItem('token', res.token);
console.log(res.token)
  const usuario = {
    id: res.usuario.id,
    email: res.usuario.email,
    role: res.usuario.rol,
    nombre: res.usuario.nombre,
    apellido: res.usuario.apellido,
    telefono:res.usuario.telefono
  };

  localStorage.setItem('user', JSON.stringify(usuario));

  this.loading = false;

  console.log(usuario);
  this.router.navigate(['/dashboard']);
},

      error: () => {
        this.error = 'Email o contraseña incorrectos';
        this.loading = false;
      }
    });
}

}
