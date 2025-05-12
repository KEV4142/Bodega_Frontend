import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated() && this.authService.isAdministrador()) {
      return true;
    } 
    else if (this.authService.isAuthenticated() && this.authService.isOperador()) {
        return true;
      }
    else {
      this.router.navigate(['/login']);
      this.authService.logout();
      return false;
    }
  }
}
