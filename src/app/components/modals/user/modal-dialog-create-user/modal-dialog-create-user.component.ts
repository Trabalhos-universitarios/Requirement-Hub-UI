import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormServices } from 'src/app/services/forms/reactive-form-services.service';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { AlertService } from 'src/app/services/sweetalert/alert.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-modal-dialog-create-user',
  templateUrl: './modal-dialog-create-user.component.html',
  styleUrls: ['./modal-dialog-create-user.component.scss']
})
export class ModalDialogCreateUserComponent implements OnInit {
  formGroup?: FormGroup | null;
  buttonDisabled: boolean = true;

  constructor(
    private reactiveFormService: ReactiveFormServices,
    private alertService: AlertService,
    private dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private spinnerService: SpinnerService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    // Inscreva-se para mudanças no serviço para receber o FormGroup atualizado
    this.reactiveFormService.currentForm.subscribe(form => {
      this.formGroup = form;
      this.buttonDisabled = !(form?.valid);
    });
  }

  close() {
    this.dialog.closeAll();
  }

  onFormValidityChange(valid: boolean) {
    this.buttonDisabled = !valid;
  }

  async saveData(): Promise<void> {
    this.spinnerService.start();
    if (this.formGroup?.valid) {
      try {
        const formData = this.formGroup.value;
        const createdUser = await this.usersService.createUser(formData);
        console.log('Usuário criado com sucesso:', createdUser);
        this.alertService.toSuccessAlert('Usuário criado com sucesso!');
        this.close();
      } catch (error) {
        console.error('Erro ao criar o usuário:', error);
        this.alertService.toErrorAlert('Erro: ', 'Erro ao criar o usuário.');
      } finally {
        this.spinnerService.stop();
      }
    }
  }
}
