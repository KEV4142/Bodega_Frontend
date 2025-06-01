import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sucursal } from '../Paginas/salidas/salida-dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  constructor(private http: HttpClient) {}

  obtenerSucursalesActivas(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(`${environment.apiUrl}sucursales/activos`);
  }
}
