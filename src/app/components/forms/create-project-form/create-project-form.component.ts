import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CreateProjectFormService} from "../../../services/components/forms/create-project-form.service";

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
        projectDescription: new FormControl('', Validators.required),
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
