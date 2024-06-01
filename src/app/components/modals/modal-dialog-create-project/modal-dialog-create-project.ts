import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {CreateProjectFormService} from "../../../services/components/forms/create-project-form.service";
import {AlertService} from "../../../services/shared/sweetalert/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateProjectTabComponent} from "../../tabs/create-project-tab/create-project-tab.component";
import {ProjectsService} from "../../../services/shared/projects/projects.service";
import {Status} from "../../tables/projecs-table/utils/status";

@Component({
    selector: 'app-modal-dialog-create-project',
    templateUrl: './modal-dialog-create-project.html',
    styleUrls: ['./modal-dialog-create-project.scss']
})
export class ModalDialogComponent implements OnInit {

    @ViewChild(CreateProjectTabComponent) tabComponent!: CreateProjectTabComponent;

    formGroup?: FormGroup | null;
    buttonDisabled: boolean = true;

    constructor(
        private createProjectService: CreateProjectFormService,
        private projectService: ProjectsService,
        private alertService: AlertService,
        private dialog: MatDialog) {
    }


    ngOnInit() {
        this.createProjectService.currentForm.subscribe(form => {
            this.formGroup = form;
            this.buttonDisabled = !(form?.valid);
        });
    }

    getData() {
        this.projectService.getProjects().subscribe(posts => {
            for (let data of posts) {
                console.log("PROJECTS OBJECT: ", data);
            }
            // TODO AQUI TERÁ A LÓGICA PARA TRATAR SE O PROJETO JÁ EXISTIR NO BACK END
        });
    }


    async saveData() {
        this.getData();

        if (this.formGroup && this.formGroup.valid) {
            const projectData =
                {
                    ...this.formGroup.value,
                    creationDate: new Date().toISOString(),
                    status: Status.ACTIVE
                };

            this.projectService.createProject(projectData).subscribe(resp => {
                if (resp) {
                    this.alertService.toSuccessAlert("Projeto Salvo com sucesso!");
                    this.dialog.closeAll();
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }
            });
        }
    }
}

