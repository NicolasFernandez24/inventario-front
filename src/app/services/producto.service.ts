import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Producto {
  id?: number;

  codigo: string;
  nombre: string;
  descripcion: string;

  categoria_id: number;
  proveedor_id?: number;

  categoria?: string;
  proveedor?: string;

  precio_costo: number;
  precio_venta: number;

  stock_minimo: number;
  stock: number;

  creado_en?: string;
  actualizado_en?: string;
}


@Injectable({ providedIn: 'root' })
export class ProductoService {

  private apiUrl = environment.apiUrl + '/api/productos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(data: Producto): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  update(id: number, data: Producto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
   getStockBajo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stock-bajo`);
  }
}
