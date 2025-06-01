import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoRow } from '../Paginas/salidas/salida-dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  constructor(private http: HttpClient) {}

  obtenerLotesDisponibles(productoID: number, cantidad: number): Observable<ProductoRow[]> {
    return this.http.post<ProductoRow[]>(`${environment.apiUrl}lotes/disponible`, {
      productoID,
      cantidad,
    });
  }
}
