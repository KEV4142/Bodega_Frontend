import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';


interface LoginResponse {
  token: string;
  email: string;
  nombreCompleto: string;
  username: string;
  tipo: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl+'account/login';
  private apiUrl1 = environment.apiUrl+'account/me';

  private Tipo : string | undefined;
  private Usuario : string="";

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, {
      Email: email,
      Password: password
    })
    .pipe(
      tap(res=>{
        this.saveToken(res.token);
        this.setAdmin(res.tipo);
        this.setUsuario(res.username);
      })
    )
  }

  getUserDetails(): Observable<LoginResponse> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Sin Autorizacion!!');
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<LoginResponse>(this.apiUrl1, { headers })
    .pipe(
      tap(res=>this.setAdmin(res.tipo))
    )
  }

  setAdmin(admin:string): void{
    this.Tipo=admin;
  }
  setUsuario(parametro:string): void{
    this.Usuario=parametro;
  }
  getUsuario(): string{
    return this.Usuario;
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    //sessionStorage.setItem('authToken', token);
  }
  getToken(): string | null {
    // return sessionStorage.getItem('authToken');
    return localStorage.getItem('authToken');
  }
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
  isAdministrador(): boolean{
    return this.Tipo === 'Administrador';
  }
  isOperador(): boolean{
    return this.Tipo === 'Operador';
  }
  logout(): void {
    // sessionStorage.clear();
    localStorage.clear();
  }
}
