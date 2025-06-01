import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../Paginas/salidas/salida-dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient) {}

  obtenerProductosActivos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.apiUrl}productos/activos`);
  }
}
