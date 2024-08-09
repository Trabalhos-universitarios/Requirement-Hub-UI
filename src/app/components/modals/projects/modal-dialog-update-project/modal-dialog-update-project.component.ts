import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProjectTabComponent } from 'src/app/components/tabs/update-project-tab/update-project-tab.component';
import { ProjectDataModel } from 'src/app/models/project-data-model';
import { ReactiveFormServices } from 'src/app/services/forms/reactive-form-services.service';
import { ProjectsTableService } from 'src/app/services/projects/projects-table.service';
import { UpdateProjectsService } from 'src/app/services/projects/update-projects.service';
import { RichTextService } from 'src/app/services/richText/rich-text.service';
import { AlertService } from 'src/app/services/sweetalert/alert.service';
import { Status } from 'src/app/utils/util.status';

@Component({
  selector: 'app-modal-dialog-update-project',
  templateUrl: './modal-dialog-update-project.component.html',
  styleUrls: ['./modal-dialog-update-project.component.scss']
}) 
export class ModalDialogUpdateProjectComponent implements OnInit {

  @ViewChild(UpdateProjectTabComponent) tabComponent!: UpdateProjectTabComponent;

    formGroup?: FormGroup | null;
    buttonDisabled: boolean = true;
    private descriptionProject: string = '';

    constructor(
        private reactiveFormService: ReactiveFormServices,
        private updateProjectService: UpdateProjectsService,
        private alertService: AlertService,
        private dialog: MatDialog,
        private richTextService: RichTextService,
        private projectTableService: ProjectsTableService) {
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

    close(){
        this.dialog.closeAll();
    }

    async saveData() {

        if (this.formGroup && this.formGroup.valid) {

            const prepareData: ProjectDataModel =
                {
                    ...this.formGroup.value,
                    businessAnalysts: this.formGroup.value.businessAnalysts.map((v: { id: any; }) => v.id),
                    commonUsers: this.formGroup.value.commonUsers.map((v: { id: any; }) => v.id),
                    manager: this.formGroup.value.manager.id,
                    requirementAnalysts: this.formGroup.value.requirementAnalysts.map((v: { id: any; }) => v.id),
                    description: this.descriptionProject,
                    status: Status.ACTIVE
                };

            this.updateProjectService.updateProject(this.projectTableService.currentIdProject, prepareData).subscribe(resp => {
                if (resp) {
                    this.alertService.toSuccessAlert("Projeto atualizado com sucesso!");
                    this.dialog.closeAll();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            });
        }
    }

}
