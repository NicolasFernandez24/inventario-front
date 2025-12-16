import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }) {
    return this.http.post(`${this.api}/auth/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.api}/auth/register`, data);
  }
  getrole() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).role : null;
  
}
logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

}
