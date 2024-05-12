import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-create-project-form',
    templateUrl: './create-project-form.component.html',
    styleUrls: ['./create-project-form.component.scss']
})
export class CreateProjectFormComponent {

    constructor(private formBuilder: FormBuilder) {
    }

    formGroup: FormGroup = this.formBuilder.group( {
        nameProject: new FormControl('', Validators.required),
        nameProjectManager: new FormControl('', Validators.required),
        nameRequirementAnalyst: new FormControl('', Validators.required),
        nameBusinessAnalyst: new FormControl(''),
        nameCommonUser: new FormControl(''),
        projectDescription: new FormControl('', Validators.required),

    })

    toppings = new FormControl('');

    toppingList: string[] = ['Johnny Carvalho', 'Lucas Lemes', 'Elias Coutinho', 'Bruna Carvalho', 'Rebeca Carvalho', 'João Victor'];

    nextPage() {

    }

}
