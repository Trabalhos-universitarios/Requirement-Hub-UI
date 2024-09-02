import {Component, Inject} from '@angular/core';
import {RequirementsService} from "../../../../services/requirements/requirements.service";
import {ProjectsTableService} from "../../../../services/projects/projects-table.service";
import {AlertService} from "../../../../services/sweetalert/alert.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {LocalStorageService} from "../../../../services/localstorage/local-storage.service";
import {SpinnerService} from "../../../../services/spinner/spinner.service";
import {reloadPage} from "../../../../utils/reload.page";
import {RequirementsDataModel} from "../../../../models/requirements-data-model";
import { RichTextService } from 'src/app/services/richText/rich-text.service';

@Component({
    selector: 'app-modal-dialog-update-requirement',
    templateUrl: './modal-dialog-update-requirement.component.html',
    styleUrls: ['./modal-dialog-update-requirement.component.scss']
})
export class ModalDialogUpdateRequirementComponent {

  requirementForm?: RequirementsDataModel | null;
  buttonDisabled: boolean = true;

    constructor(
        private requirementService: RequirementsService,
        private projectsTableService: ProjectsTableService,
        private alertService: AlertService,
        private dialog: MatDialog,
        private localStorageService: LocalStorageService,
        private spinnerService: SpinnerService,
        private richTextService: RichTextService,
        @Inject(MAT_DIALOG_DATA) public data: RequirementsDataModel) {

        this.requirementService.currentForm.subscribe(form => {
            this.requirementForm = form;
            this.buttonDisabled = !(form?.valid && form?.value);
        });
    }

    async saveData(): Promise<void> {
        try {
            this.spinnerService.start();
            const response = await this.requirementService.updateRequirements(this.data.id, this.prepareData()).then(response => response.identifier);

            if (response) {
                await this.alertService.toSuccessAlert(`Reququisito ${response} atualizado com sucesso!`);
                this.clearLocalStorage()
                this.spinnerService.stop();
                this.dialog.closeAll();
                reloadPage();
                this.spinnerService.start();
            }
        } catch (error) {
            this.spinnerService.stop();
            switch (error) {
                case 404:
                    console.error(`NOT FOUND: ${error}`);
                    await this.alertService.toErrorAlert("Erro!", "Rota não encontrada ou fora!");
                    break;
                case 500:
                    console.error(`INTERNAL SERVER ERROR: ${error}`);
                    await this.alertService.toErrorAlert("Erro!", "Erro interno do servidor!");
                    break;
                default:
                    console.error(`ERROR: ${error}`);
                    await this.alertService.toErrorAlert("Erro!", "Erro ao cadastrar requisito - " + error);
            }
        }
    }

    private prepareData() {

      let descriptionValue: string = '';

      this.richTextService.currentContent.subscribe(content => {
          descriptionValue = content;
      })
        return  {
            ...this.requirementForm,
            description: descriptionValue,
            author: this.localStorageService.getItem("id"),
            projectRelated: this.projectsTableService.getCurrentProjectById(),
            stakeholders: this.localStorageService.getItem("stakeholders"),
            responsible: this.localStorageService.getItem("responsible"),
            dependencies: this.localStorageService.getItem("dependencies"),
        }
    }

    close() {
        this.clearLocalStorage();
        this.dialog.closeAll();
    }

    private clearLocalStorage() {
        this.localStorageService.removeItem('file');
        this.localStorageService.removeItem('stakeholders');
        this.localStorageService.removeItem('responsible');
        this.localStorageService.removeItem('dependencies');
        this.localStorageService.removeItem('requirement');
        this.localStorageService.removeItem('artifact');
    }
}
