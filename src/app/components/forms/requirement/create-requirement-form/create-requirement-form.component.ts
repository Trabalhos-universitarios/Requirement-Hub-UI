import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RequirementsService} from "../../../../services/requirements/requirements.service";

@Component({
  selector: 'app-create-requirement-form',
  templateUrl: './create-requirement-form.component.html',
  styleUrls: ['./create-requirement-form.component.scss']
})
export class CreateRequirementFormComponent {

  public formGroup: FormGroup = this.formBuilder.group( {
    projectRelated: new FormControl({ value: 'Requirement Hub', disabled: true }), //TODO NÃO ESQUECER DE FAZER LÓGICA PARA BUSCAR NOME DO PROJETO
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
    dependencyRequirement: new FormControl(''),
    requirementDescription: new FormControl(''),
  })

  constructor(private formBuilder: FormBuilder, private requirementService: RequirementsService) {
    this.createForm()
  }

  createForm() {
    this.formGroup.valueChanges.subscribe(val => {
      this.requirementService.updateForm(this.formGroup);
    });
  }

  //todo Esses dados virão do back-end  o futuro
  employeeList: string[] = ['Johnny Carvalho', 'Lucas Lemes', 'Elias Coutinho', 'Bruna Carvalho', 'Rebeca Carvalho', 'João Victor'];
  fontList: string[] = ['Negócios', 'Produtos', 'Engenharia', 'Cliente', 'Design', 'Desenvolvimento'];
  riskList: string[] = ['Pequeno', 'Médio', 'Alto'];
  priorityList: string[] = ['Alta', 'Média', 'Baixa'];
  typeList: string[] = ['Funcional', 'Nào Funcional']
  esforcoList: string[] = ['Alta', 'Média', 'Baixa'];
  requirementsIdsList: string[] = ['RF1', 'RF2', 'RF3', 'RF4', 'RF5', 'RF6', 'RF7', 'RF8', 'RF9', 'RF10', ]
}
