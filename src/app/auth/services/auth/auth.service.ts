import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private localStorage : LocalStorageService) { }

  isLoggedIn(): boolean {
    const userLogged = this.localStorage.getItem('userLogged');
    if (userLogged === true) {
      return true;
    } else {
      return false;
    }
  }
}

