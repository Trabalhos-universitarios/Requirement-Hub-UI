import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CreateProjectDataModel } from 'src/app/models/create-project-data-model';
import { UserResponseModel } from 'src/app/models/user-model';
import { ReactiveFormServices } from 'src/app/services/forms/reactive-form-services.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { UpdateProjectsService } from 'src/app/services/projects/update-projects.service';
import { RichTextService } from 'src/app/services/richText/rich-text.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-update-project-form',
  templateUrl: './update-project-form.component.html',
  styleUrls: ['./update-project-form.component.scss']
})
export class UpdateProjectFormComponent{

    public managers: UserResponseModel[] = [];
    public requirementsAnalysts: UserResponseModel[] = [];
    public businessAnalysts: UserResponseModel[] = [];
    public commonUsers: UserResponseModel[] = [];

    dataSource = new MatTableDataSource<CreateProjectDataModel>([]);

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
        private updateFormService: ReactiveFormServices,
        private updateProjectService : UpdateProjectsService,
        private userService: UsersService,
        private richTextService: RichTextService) {
        this.formValueSubscriber()
        this.getData();
    }

    compareObjects(obj1: any, obj2: any): boolean {
        return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
    }

    formValueSubscriber() {
        this.formGroup.valueChanges.subscribe(val => {
            this.updateFormService.updateForm(this.formGroup);
        });
    }

    getFormData(indexTab: number | undefined) {
        return this.formGroup.value;
    }

    getUsers(): void {
        this.userService.getManager()
            .then(resp => {
                this.managers = resp;
                console.log(this.managers);
            })
            .catch(error => {
                console.error(`Error : ${error} -> ${error.message}`);
            });
    
        this.userService.getRequirementAnalysts()
            .then(resp => {
                this.requirementsAnalysts = resp;
                console.log(this.requirementsAnalysts);
            })
            .catch(error => {
                console.error(`Error: ${error} -> ${error.message}`);
            });
    
        this.userService.getBusinessAnalysts()
            .then(resp => {
                this.businessAnalysts = resp;
                console.log(this.businessAnalysts);
            })
            .catch(error => {
                console.error(`Error: ${error} -> ${error.message}`);
            });
    
        this.userService.getCommonUsers()
            .then(resp => {
                this.commonUsers = resp;
                console.log(this.commonUsers);
            })
            .catch(error => {
                console.error(`Error: ${error} -> ${error.message}`);
            });
    }

    getData() {
        this.getUsers();
        this.updateProjectService.getProject().subscribe((project: CreateProjectDataModel) => {

            console.log(project);
            
            this.formGroup.patchValue({
                name: project.name,
                version: project.version,
                description: project.description
            });

            this.richTextService.changeContent(project.description);
            
            console.log(this.formGroup.value);
        });
    }

    
}
