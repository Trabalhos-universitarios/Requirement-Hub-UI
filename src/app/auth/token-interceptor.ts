import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      const formattedToken = token.replace(/"/g, ''); 
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${formattedToken}`
        }
      });
    }
    return next.handle(request);
  }
}