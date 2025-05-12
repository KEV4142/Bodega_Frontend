import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
  const authService = inject(AuthService); 
  const token = authService.getToken();
  const excludedUrls = ['/login'];

  const isExcluded = excludedUrls.some((url) => req.url.includes(url));

  if (isExcluded) {
    return next(req);
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    throw new Error('Sin autorización!');
  }

  return next(req);
}