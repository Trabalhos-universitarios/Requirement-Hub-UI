import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    // Verifica se a URL começa com http://localhost:3000/matrix   PROVISORIO
    //if (!request.url.startsWith('http://localhost:3000/matrix')) {
      if (token) {
        const formattedToken = token.replace(/"/g, ''); 
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${formattedToken}`
          }
        });
      }
    //}
    return next.handle(request);
  }
}
