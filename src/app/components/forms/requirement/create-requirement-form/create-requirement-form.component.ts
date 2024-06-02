import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CreateProjectFormService} from "../../../../services/components/forms/create-project-form.service";

@Component({
  selector: 'app-create-requirement-form',
  templateUrl: './create-requirement-form.component.html',
  styleUrls: ['./create-requirement-form.component.scss']
})
export class CreateRequirementFormComponent {

  public formGroup: FormGroup = this.formBuilder.group( {
    identifierRequirement: new FormControl('', Validators.required),
    nameRequirement: new FormControl('', Validators.required),
    versionRequirement: new FormControl('', Validators.required),
    authorRequirement: new FormControl('', Validators.required),
    fontRequirement: new FormControl('', Validators.required),
    dangerRequirement: new FormControl('', Validators.required),
    priorityRequirement: new FormControl('', Validators.required),
    responsibleRequirement: new FormControl('', Validators.required),
    typeRequirement: new FormControl('', Validators.required),
    effortRequirement: new FormControl('', Validators.required),
    releaseRequirement: new FormControl('', Validators.required),
    dependencyRequirement: new FormControl('', Validators.required),
    requirementDescription: new FormControl('', Validators.required),
  })

  constructor(private formBuilder: FormBuilder, private createProjectService: CreateProjectFormService) {
    this.createForm()
  }

  createForm() {
    this.formGroup.valueChanges.subscribe(val => {
      this.createProjectService.updateForm(this.formGroup);
    });
  }

  getFormData(indexTab: number | undefined) {
    return this.formGroup.value;
  }

  //todo Esses dados virão do back-end  o futuro
  toppingList: string[] = ['Johnny Carvalho', 'Lucas Lemes', 'Elias Coutinho', 'Bruna Carvalho', 'Rebeca Carvalho', 'João Victor'];



}
