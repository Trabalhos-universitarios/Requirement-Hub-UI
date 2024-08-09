import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';
import { LoginService } from 'src/app/auth/services/login/login.service';
import { ModalLoginComponent } from '../../modals/modal-login/modal-login.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private dialog: MatDialog,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.localStorageService.clearAll(),
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { login, password } = this.loginForm.getRawValue();
      this.loginService.login(login, password).subscribe({
        next: (response) => {
          this.localStorageService.setItem('token', response.token);
          this.localStorageService.setItem('role', response.role);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.dialog.open(ModalLoginComponent, {
            width: '300px',
            data: { message: 'Usuário ou senha invalida!.' }
          });
        }
      });
    }
  }
}