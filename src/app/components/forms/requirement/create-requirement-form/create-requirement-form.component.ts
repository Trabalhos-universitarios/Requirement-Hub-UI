import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RequirementsService} from "../../../../services/requirements/requirements.service";
import { ProjectsTableService } from 'src/app/services/projects/projects-table.service';

@Component({
  selector: 'app-create-requirement-form',
  templateUrl: './create-requirement-form.component.html',
  styleUrls: ['./create-requirement-form.component.scss']
})
export class CreateRequirementFormComponent {

  public formGroup: FormGroup = this.formBuilder.group( {
    projectRelated: new FormControl({value: "", disabled: true}),
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

  constructor(private formBuilder: FormBuilder, private requirementService: RequirementsService, 
    private projectsTableService: ProjectsTableService) {
    this.createForm();
    this.getCurrentProject();
  }

  createForm() {
    this.formGroup.valueChanges.subscribe(val => {
      this.requirementService.updateForm(this.formGroup);
      this.formGroup.value.projectRelated = this.projectsTableService.getCurrentProject();
    });
  }

  getCurrentProject(){
    this.formGroup.patchValue({
  projectRelated: this.projectsTableService.getCurrentProject()
});
  }

  //todo Esses dados virão do back-end  o futuro
  employeeList: string[] = ['Johnny Carvalho', 'Lucas Lemes', 'Elias Coutinho', 'Bruna Carvalho', 'Rebeca Carvalho', 'João Victor'];
  fontList: string[] = ['Negócios', 'Produtos', 'Engenharia', 'Cliente', 'Design', 'Desenvolvimento'];
  riskList: string[] = ['Pequeno', 'Médio', 'Alto'];
  priorityList: string[] = ['Alta', 'Média', 'Baixa'];
  typeList: string[] = ['Funcional', 'Nào Funcional']
  esforcoList: string[] = ['Alta', 'Média', 'Baixa'];
  requirementsIdsList: string[] = ['RF001', 'RF002', 'RF003', 'RF004', 'RF005', 'RF006', 'RF007', 'RF008', 'RF009', 'RF010', ]
}
