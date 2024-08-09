import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environmentLocal } from 'src/environment/environment-local';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = environmentLocal.springUrl

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/authenticate`, { username, password });
  }
}
