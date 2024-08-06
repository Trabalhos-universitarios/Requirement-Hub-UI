import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ReactiveFormServices} from "../../../services/forms/reactive-form-services.service";
import {UsersService} from "../../../services/users/users.service";
import {UserResponseModel} from "../../../models/user-model";

@Component({
    selector: 'app-create-project-form',
    templateUrl: './create-project-form.component.html',
    styleUrls: ['./create-project-form.component.scss']
})
export class CreateProjectFormComponent implements OnInit {

    public managers: UserResponseModel[] = [];
    public requirementsAnalysts: UserResponseModel[] = [];
    public businessAnalysts: UserResponseModel[] = [];
    public commonUsers: UserResponseModel[] = [];

    public formGroup: FormGroup = this.formBuilder.group({
        name: new FormControl('', Validators.required),
        manager: new FormControl('', Validators.required),
        requirementAnalysts: new FormControl('', Validators.required),
        businessAnalysts: new FormControl(''),
        commonUsers: new FormControl(''),
        version: new FormControl('', Validators.required),
        description: new FormControl('')
    })

    constructor(
        private formBuilder: FormBuilder,
        private createProjectService: ReactiveFormServices,
        private userService: UsersService) {
        this.formValueSubscriber()
    }

    async ngOnInit(): Promise<void> {
        await this.getUsers()
    }

    compareObjects(obj1: any, obj2: any): boolean {
        return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
    }

    formValueSubscriber() {
        this.formGroup.valueChanges.subscribe(val => {
            this.createProjectService.updateForm(this.formGroup);
        });
    }

    getFormData(indexTab: number | undefined) {
        return this.formGroup.value;
    }

    async getUsers(): Promise<void> {

        await this.userService.getManager()
            .then(resp => {this.managers = resp})
            .catch(error => {console.error(`Error : ${error} -> ${error.message}`)});

        await this.userService.getRequirementAnalysts()
            .then(resp => {this.requirementsAnalysts = resp})
            .catch(error => {console.error(`Error: ${error} -> ${error.message}`)});

        await this.userService.getBusinessAnalysts()
            .then(resp => {this.businessAnalysts = resp})
            .catch(error => {console.error(`Error: ${error} -> ${error.message}`)});

        await this.userService.getCommonUsers()
            .then(resp => {this.commonUsers = resp})
            .catch(error => {console.error(`Error: ${error} -> ${error.message}`)});
    }
}
