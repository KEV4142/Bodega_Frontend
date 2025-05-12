import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule,MatButtonModule, MatMenuModule, MatToolbarModule,MatIconModule],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
  userType: string | undefined;
  usuario: string="";
  isSmallScreen: boolean = false;

  constructor(private authService: AuthService,private router: Router) {
    this.checkScreenSize();
    this.usuario=authService.getUsuario();
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }
  private checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 1024;
  }
  
  isAdmin(): boolean {
    return this.authService.isAdministrador();
  }

  optTablero():void{
    this.router.navigate(['/dashboard'])
  }

  optRegistro():void{
    this.router.navigate(['/registroSalidas'])
  }
  optListado():void{
    this.router.navigate(['/listadoSalidas'])
  }

  salir(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
