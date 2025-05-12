import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { AuthGuard } from './auth.guard';
import { provideHttpClient,withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './Funciones/authInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withComponentInputBinding()),
    AuthGuard,
    provideAnimationsAsync(),
    importProvidersFrom(BrowserAnimationsModule),
  ]
};
