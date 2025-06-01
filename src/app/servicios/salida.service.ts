import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoRow, SalidaResponse } from '../Paginas/salidas/salida-dto';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalidaService {

  constructor(private http: HttpClient) {}

  registrarSalida(sucursalid: number, productos: ProductoRow[]): Observable<SalidaResponse> {
    const salidaData = {
      sucursalid,
      salidasdetalle: productos.map((linea) => ({
        loteid: linea.loteID,
        cantidad: linea.cantidad,
      })),
    };
    return this.http.post<SalidaResponse>(`${environment.apiUrl}salidas/ingreso`, salidaData);
  }

  obtenerPaginado<T>(ruta: string, params: HttpParams) {
    return this.http.get<{
      currentPage: number;
      totalPages: number;
      pageSize: number;
      totalCount: number;
      items: T[];
    }>(`${environment.apiUrl}${ruta}/paginacion`, { params });
  }

  actualizarEstado<T>(ruta: string, id: number, estado: string) {
    return this.http.put<T>(`${environment.apiUrl}${ruta}/estado/${id}`, { estado });
  }
}
