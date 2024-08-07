import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { ModalLoginComponent } from 'src/app/components/modals/modal-login/modal-login.component';
import { LoginService } from 'src/app/services/login/login.service';

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
    private router: Router  // Injeta o Router
  ) {
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
          this.dialog.open(ModalLoginComponent, {
            width: '300px',
            data: { message: 'Login successful!' }
          }).afterClosed().subscribe(() => {
            this.router.navigate(['/home']);  // Redireciona para a rota 'home'
          });
        },
        error: (err) => {
          this.dialog.open(ModalLoginComponent, {
            width: '300px',
            data: { message: 'Login failed. Please try again.' }
          });
        }
      });
    }
  }
}
