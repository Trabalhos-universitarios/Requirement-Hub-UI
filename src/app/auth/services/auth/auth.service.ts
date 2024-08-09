import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private localStorage : LocalStorageService) { }

  isLoggedIn(): boolean {
    const token = this.localStorage.getItem('token');
    if (token) {
      return true;
    } else {
      return false;
    }
  }
}

