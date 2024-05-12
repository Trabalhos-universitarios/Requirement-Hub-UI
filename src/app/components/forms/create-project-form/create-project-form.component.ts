import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CreateProjectService} from "../../../services/components/forms/create-project.service";

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

    constructor(private formBuilder: FormBuilder, private createProjectService: CreateProjectService) {
        this.createForm()
    }

    createForm() {
        this.formGroup.valueChanges.subscribe(val => {
            this.createProjectService.updateForm(this.formGroup);
        });
    }


    toppingList: string[] = ['Johnny Carvalho', 'Lucas Lemes', 'Elias Coutinho', 'Bruna Carvalho', 'Rebeca Carvalho', 'João Victor'];

}
