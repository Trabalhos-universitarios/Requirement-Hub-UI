import {Component} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {RequirementsService} from "../../../../services/requirements/requirements.service";
import {AlertService} from "../../../../services/sweetalert/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {ArtifactService} from "../../../../services/requirements/artifacts/artifact.service";
import {LocalStorageService} from "../../../../services/localstorage/local-storage.service";
import {Status} from "../../../../utils/util.status";
import {ProjectsTableService} from "../../../../services/projects/projects-table.service";
import {RichTextService} from "../../../../services/richText/rich-text.service";
import {SpinnerService} from "../../../../services/spinner/spinner.service";
import {reloadPage} from "../../../../utils/reload.page";
import {RequirementsDataModel} from "../../../../models/requirements-data-model";

@Component({
    selector: 'app-modal-dialog-create-requirement',
    templateUrl: './modal-dialog-create-requirement.component.html',
    styleUrls: ['./modal-dialog-create-requirement.component.scss']
})
export class ModalDialogCreateRequirementComponent {

    requirementForm?: FormGroup | null;
    artifactForm?: FormGroup | null;
    buttonDisabled: boolean = true;

    constructor(
        private requirementService: RequirementsService,
        private projectsTableService: ProjectsTableService,
        private richTextService: RichTextService,
        private alertService: AlertService,
        private dialog: MatDialog,
        private localStorageService: LocalStorageService,
        private spinnerService: SpinnerService) {

        this.requirementService.currentForm.subscribe(form => {
            this.requirementForm = form;
            this.buttonDisabled = !(form?.valid && form?.value);
        });
    }

    optionalSaveData() {
        this.alertService.toOptionalWith3Buttons("Deseja enviar para fluxo de aprovação?", "Sim, enviar!", "Não, apensas salvar")
            .then(resp => {
                if (resp.isConfirmed) {
                    this.sendToApprovalFlow().then();
                } else if (resp.isDenied) {
                    this.saveData().then();
                } else {
                    console.log("Cancelar");
                }
            });
    }

    private async sendToApprovalFlow() {
        this.spinnerService.start();
        const response = await this.requirementService.createAndSendToApprovalFlow(this.prepareData()).then(response => response.identifier);
        if (response) {
            await this.alertService.toSuccessAlert(`Reququisito ${response} enviado com sucesso!`);
            this.localStorageService.removeItem('file');
            this.dialog.closeAll();
            this.spinnerService.stop();
            reloadPage();
            this.spinnerService.start();
        }
    }

    private async saveData(): Promise<void> {
        try {
            this.spinnerService.start();
            const response = await this.requirementService.createRequirements(this.prepareData()).then(response => response.identifier);

            if (response) {
                await this.alertService.toSuccessAlert(`Reququisito ${response} cadastrado com sucesso!`);
                this.localStorageService.removeItem('file');
                this.dialog.closeAll();
                this.spinnerService.stop();
                reloadPage();
                this.spinnerService.start();
            }
        } catch (error) {
            this.spinnerService.stop()
            switch (error) {
                case 409:
                    console.error(`CONFLICT: ${error}`);
                    await this.alertService.toErrorAlert("Erro!", "Já existe um requisito com esse nome vinculado a esse projeto!");
                    break;
                case 404:
                    console.error(`NOT FOUND: ${error}`);
                    await this.alertService.toErrorAlert("Erro!", "Rota não encontrada ou fora!");
                    break;
                case 405:
                    console.error(`METHOD NOT ALLOWED: ${error}`);
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

        if (this.requirementForm && this.requirementForm.valid) {
            return {
                ...this.requirementForm.value,
                effort: Number(this.requirementForm.value.effort),
                projectRelated: {id: this.projectsTableService.getCurrentProjectById()},
                author: this.localStorageService.getItem("id"),
                description: descriptionValue,
                stakeholders: this.requirementForm.value.stakeholders
                ? this.requirementForm.value.stakeholders.map((item: { id: number }) => ({ id: item.id }))
                : null,
                dependencies: this.requirementForm.value.dependencies
                ? this.requirementForm.value.dependencies.map((item: { id: number }) => ({ id: item.id }))
                : null,
                responsible: this.requirementForm.value.responsible
                ? this.requirementForm.value.responsible.map((item: { id: number }) => ({ id: item.id }))
                : null,
                //todo Não remover, pois será usado na sequIencia
                // files: fileData,
                // requirementId: requirementId // Inclui o ID do requisito
            }
        }
    }

    prepareDataArtifact(requirementId?: string) {
        //todo Não remover, pois será usado na sequIencia
        const fileData = this.localStorageService.getItem('file');
        if (this.artifactForm && this.artifactForm.valid) {
            return {
                ...this.artifactForm.value,
                creationDate: new Date().toISOString(),
                status: Status.CREATED,
                files: fileData,
                requirementId: requirementId
            };
        }
    }

    close() {
        this.dialog.closeAll();
    }
}
