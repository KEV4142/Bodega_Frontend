import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  cargando: boolean = false;
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.cargando = true;
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.cargando = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.cargando = false;
          if (err.status === 500) {
            this.errorMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
          } else if (err.status === 401) {
            this.errorMessage = 'Correo electrónico o contraseña incorrectos.';
          } else {
            this.errorMessage = 'Ocurrió un error inesperado. Intente nuevamente.';
          }
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }
}
