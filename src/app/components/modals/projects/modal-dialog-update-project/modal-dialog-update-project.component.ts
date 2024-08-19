import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {UpdateProjectTabComponent} from 'src/app/components/tabs/update-project-tab/update-project-tab.component';
import {ProjectDataModel} from 'src/app/models/project-data-model';
import {UserResponseModel} from 'src/app/models/user-model';
import {ReactiveFormServices} from 'src/app/services/forms/reactive-form-services.service';
import {ProjectsTableService} from 'src/app/services/projects/projects-table.service';
import {UpdateProjectsService} from 'src/app/services/projects/update-projects.service';
import {RichTextService} from 'src/app/services/richText/rich-text.service';
import {AlertService} from 'src/app/services/sweetalert/alert.service';
import {Status} from 'src/app/utils/util.status';
import {SpinnerService} from "../../../../services/spinner/spinner.service";
import {reloadPage} from "../../../../utils/reload.page";

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
    private currentProjectTeam: UserResponseModel[] = [];

    constructor(
        private reactiveFormService: ReactiveFormServices,
        private updateProjectService: UpdateProjectsService,
        private alertService: AlertService,
        private dialog: MatDialog,
        private richTextService: RichTextService,
        private projectTableService: ProjectsTableService,
        private spinnerService: SpinnerService) {
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
        this.spinnerService.start();
        this.currentProjectTeam = this.updateProjectService.getCurrentProjectTeam();

        if (this.formGroup && this.formGroup.valid) {
            const businessAnalysts = this.currentProjectTeam
                .filter(member => member.role === 'ANALISTA_DE_NEGOCIO')
                .map(member => member.id);

            const commonUsers = this.currentProjectTeam
                .filter(member => member.role === 'USUARIO_COMUM')
                .map(member => member.id);

            const requirementAnalysts = this.currentProjectTeam
                .filter(member => member.role === 'ANALISTA_DE_REQUISITOS')
                .map(member => member.id);

            const prepareData: ProjectDataModel = this.prepareData(businessAnalysts, commonUsers, requirementAnalysts, this.formGroup);

            this.updateProjectService.updateProject(this.projectTableService.currentIdProject, prepareData).subscribe(resp => {
                if (resp) {
                    this.alertService.toSuccessAlert("Projeto atualizado com sucesso!");
                    this.dialog.closeAll();
                    reloadPage()
                    this.spinnerService.stop();
                }
            });
        }
    }

    private prepareData(
        businessAnalysts: string[],
        commonUsers: string[],
        requirementAnalysts: string[],
        formGroup:  FormGroup<any>): ProjectDataModel {
        return  {
            ...formGroup.value,
            businessAnalysts: businessAnalysts,
            commonUsers: commonUsers,
            manager: formGroup.value.manager.name,
            requirementAnalysts: requirementAnalysts,
            description: this.descriptionProject,
            status: Status.ACTIVE
        };
    }
}
