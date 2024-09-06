import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';
import { environmentLocal } from 'src/environment/environment-local';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private localStorage : LocalStorageService, 
              private http: HttpClient) { }

  private baseUrl = environmentLocal.springUrl

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/authenticate`, { username, password });
  }

  isLoggedIn(): boolean {
    const userLogged = this.localStorage.getItem('userLogged');
    return userLogged === true;
  }
}
