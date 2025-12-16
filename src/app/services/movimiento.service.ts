import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Movimiento {
  id?: number;
  producto_id: number | null;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  motivo?: string;
  usuario_id: number | null;
  fecha?: string;
  producto_nombre?: string;
  usuario_nombre?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  private apiUrl = environment.apiUrl + '/api';

  constructor(private http: HttpClient) {}

getAll(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/movimientos`);
}


  getByProducto(productoId: number): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(`${this.apiUrl}/productos/${productoId}/movimientos`);
  }

  create(data: Movimiento): Observable<Movimiento> {
    return this.http.post<Movimiento>(`${this.apiUrl}/movimientos`, data);
  }
}
