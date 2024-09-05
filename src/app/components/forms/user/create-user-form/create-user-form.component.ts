import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users/users.service';
import { ReactiveFormServices } from 'src/app/services/forms/reactive-form-services.service';

@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.scss']
})
export class CreateUserFormComponent {
  formInvalid: boolean = true;
  hide = true;

  roles = ['GERENTE_DE_PROJETOS', 'ANALISTA_DE_REQUISITOS', 'ANALISTA_DE_NEGOCIO', 'USUARIO_COMUM'];

  public formGroup: FormGroup = this.formBuilder.group({
    name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
  });

  @Output() formValidityChange = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private reactiveFormService: ReactiveFormServices
  ) {
    this.formValueSubscriber();
    this.reactiveFormService.updateForm(this.formGroup);
  }

  formValueSubscriber() {
    this.formGroup.valueChanges.subscribe(() => {
      this.formInvalid = this.formGroup.invalid;
      this.reactiveFormService.updateForm(this.formGroup);
      this.formValidityChange.emit(!this.formInvalid);
    });
  }
}
