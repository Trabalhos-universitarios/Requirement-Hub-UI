import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {CreateProjectDataModel} from 'src/app/models/create-project-data-model';
import {UserResponseModel} from 'src/app/models/user-model';
import {ReactiveFormServices} from 'src/app/services/forms/reactive-form-services.service';
import {UpdateProjectsService} from 'src/app/services/projects/update-projects.service';
import {RichTextService} from 'src/app/services/richText/rich-text.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import {UsersService} from 'src/app/services/users/users.service';

@Component({
  selector: 'app-update-project-form',
  templateUrl: './update-project-form.component.html',
  styleUrls: ['./update-project-form.component.scss']
})
export class UpdateProjectFormComponent implements OnInit{

    public managers: UserResponseModel[] = [];
    dataSource = new MatTableDataSource<CreateProjectDataModel>([]);

    public formGroup: FormGroup = this.formBuilder.group({
        name: new FormControl('', Validators.required),
        manager: new FormControl('', Validators.required),
        version: new FormControl('', Validators.required),
        description: new FormControl('')
    })

    constructor(
        private formBuilder: FormBuilder,
        private updateFormService: ReactiveFormServices,
        private updateProjectService : UpdateProjectsService,
        private userService: UsersService,
        private richTextService: RichTextService,
        private spinnerService: SpinnerService) {
        this.formValueSubscriber();
    }
    async ngOnInit(): Promise<void> {
        this.spinnerService.start();
        await this.getManager();
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

    getManager(): Promise<void> {
        return this.userService.getManager()
            .then(resp => {
                this.managers = resp;
            })
            .catch(error => {
                console.error(`Error : ${error} -> ${error.message}`);
            });
    }

    getData() {
        this.updateProjectService.getProject().subscribe((project: CreateProjectDataModel) => {
            const selectedManager = this.managers.find(manager => manager.name === project.manager);
            
            this.formGroup.patchValue({
                name: project.name,
                manager: selectedManager,
                version: project.version,
                description: project.description
            });

            this.richTextService.changeContent(project.description);
            this.spinnerService.stop();
        });
    }
}
