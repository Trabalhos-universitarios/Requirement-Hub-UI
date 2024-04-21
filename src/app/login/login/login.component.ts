import { Component } from '@angular/core';
import {AxiosService} from "../../axios.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  data: string[] = [];
  constructor(private axios: AxiosService) {
    this.axios.request('post', '/login', {}).then((res) => {
      this.data = res.data;
    });
  }

}
