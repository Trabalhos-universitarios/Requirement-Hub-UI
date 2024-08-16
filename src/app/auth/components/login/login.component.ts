import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LocalStorageService} from 'src/app/services/localstorage/local-storage.service';
import {AuthService} from 'src/app/auth/services/auth/auth.service';
import {AlertService} from "../../../services/sweetalert/alert.service";
import {SpinnerService} from "../../../services/spinner/spinner.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    loginForm: FormGroup;
    hide = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private alertService: AlertService,
    private spinnerService: SpinnerService
  ) {
    this.localStorageService.clearAll(),
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

    async onSubmit() {
      this.spinnerService.start();
        if (this.loginForm.valid) {
            const {login, password} = this.loginForm.getRawValue();
            this.authService.login(login, password).subscribe({
                next: async (response) => {
                    this.localStorageService.setItem('id', response.id);
                    this.localStorageService.setItem('token', response.token);
                    this.localStorageService.setItem('role', response.role);
                    this.localStorageService.setItem('name', response.name);
                    this.localStorageService.setItem('userLogged', true);
                    this.router.navigate(['/home']).then();
                    this.spinnerService.stop();
                    await this.alertService.toSuccessAlert("Login efetuado com sucesso!")
                },
                error: async (err) => {
                    this.spinnerService.stop();
                    await this.alertService.toErrorAlert("Erro!", "Login ou senha inválidos!")
                }
            });
        }
    }

    disabledButton(): boolean {
        return !this.loginForm.valid;
    }
}
