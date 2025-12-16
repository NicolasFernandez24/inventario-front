import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Proveedor {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private apiUrl = environment.apiUrl + '/api/proveedores';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Proveedor[]>> {
    return this.http.get<ApiResponse<Proveedor[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ApiResponse<Proveedor>> {
    return this.http.get<ApiResponse<Proveedor>>(`${this.apiUrl}/${id}`);
  }

  create(proveedor: Proveedor): Observable<ApiResponse<Proveedor>> {
    return this.http.post<ApiResponse<Proveedor>>(this.apiUrl, proveedor);
  }

  update(id: number, proveedor: Proveedor): Observable<ApiResponse<Proveedor>> {
    return this.http.put<ApiResponse<Proveedor>>(`${this.apiUrl}/${id}`, proveedor);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}
