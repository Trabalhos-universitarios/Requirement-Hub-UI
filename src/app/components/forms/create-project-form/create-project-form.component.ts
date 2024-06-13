import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ReactiveFormServices} from "../../../services/forms/reactive-form-services.service";

@Component({
    selector: 'app-create-project-form',
    templateUrl: './create-project-form.component.html',
    styleUrls: ['./create-project-form.component.scss']
})
export class CreateProjectFormComponent {

    public formGroup: FormGroup = this.formBuilder.group( {
        nameProject: new FormControl('', Validators.required),
        nameProjectManager: new FormControl('', Validators.required),
        nameRequirementAnalyst: new FormControl('', Validators.required),
        nameBusinessAnalyst: new FormControl(''),
        nameCommonUser: new FormControl(''),
        version: new FormControl('', Validators.required),
        projectDescription: new FormControl('')
    })

    constructor(private formBuilder: FormBuilder, private createProjectService: ReactiveFormServices) {
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




//{
//  "id": "cad3",
//  "nameProject": "Nome ainda não definido",
//  "nameProjectManager": [
//    "Johnny Carvalho",
//    "Lucas Lemes"
//  ],
//  "nameRequirementAnalyst": [
//    "Johnny Carvalho"
//  ],
//  "nameBusinessAnalyst": [
//    "Johnny Carvalho"
//  ],
//  "nameCommonUser": [
//    "Johnny Carvalho"
//  ],
//  "projectDescription": "Testando",
//  "creationDate": "2024-05-30T19:04:22.156Z",
//  "status": "DRAFT"
//}
