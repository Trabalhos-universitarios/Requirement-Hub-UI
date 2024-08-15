import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {ReactiveFormServices} from "../../../../services/forms/reactive-form-services.service";
import {AlertService} from "../../../../services/sweetalert/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateProjectTabComponent} from "../../../tabs/create-project-tab/create-project-tab.component";
import {ProjectsService} from "../../../../services/projects/projects.service";
import {Status} from "../../../../utils/util.status";
import {RichTextService} from "../../../../services/richText/rich-text.service";
import {CreateProjectDataModel} from 'src/app/models/create-project-data-model';
import {error} from "@angular/compiler-cli/src/transformers/util";


@Component({
    selector: 'app-modal-dialog-create-project',
    templateUrl: './modal-dialog-create-project.html',
    styleUrls: ['./modal-dialog-create-project.scss']
})
export class ModalDialogCreateProjectComponent implements OnInit {

    @ViewChild(CreateProjectTabComponent) tabComponent!: CreateProjectTabComponent;

    formGroup?: FormGroup | null;
    buttonDisabled: boolean = true;
    private descriptionProject: string = '';

    constructor(
        private reactiveFormService: ReactiveFormServices,
        private projectService: ProjectsService,
        private alertService: AlertService,
        private dialog: MatDialog,
        private richTextService: RichTextService) {
    }


    ngOnInit() {
        this.reactiveFormService.currentForm.subscribe(form => {
            this.formGroup = form;
            this.buttonDisabled = !(form?.valid);
        });

        this.richTextService.currentContent.subscribe(content => {
            this.descriptionProject = content;
        });
    }

    async getData() {
        console.log("vai buscar um projeto por nome para não deixar criar repetido")
    }

    async saveData() {
        await this.getData();

        if (this.formGroup && this.formGroup.valid) {

            const prepareData: CreateProjectDataModel =
                {
                    ...this.formGroup.value,
                    businessAnalysts: this.formGroup.value.businessAnalysts.map((v: { id: any; }) => v.id),
                    commonUsers: this.formGroup.value.commonUsers.map((v: { id: any; }) => v.id),
                    manager: this.formGroup.value.manager.name,
                    requirementAnalysts: this.formGroup.value.requirementAnalysts.map((v: { id: any; }) => v.id),
                    description: this.descriptionProject,
                    status: Status.ACTIVE
                };

            this.projectService.createProject(prepareData).subscribe(resp => {
                if (resp) {
                    this.alertService.toSuccessAlert("Projeto salvo com sucesso!");
                    this.dialog.closeAll();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            });
        }
    }
}

