import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {RequirementsService} from "../../../../services/requirements/requirements.service";
import {ArtifactService} from "../../../../services/requirements/artifacts/artifact.service";
import {AlertService} from "../../../../services/sweetalert/alert.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {LocalStorageService} from "../../../../services/localstorage/local-storage.service";
import {Status} from "../../../../utils/util.status";
import {RequirementsDataModel} from "../../../../models/requirements-data-model";
import {RichTextService} from "../../../../services/richText/rich-text.service";
import {SpinnerService} from "../../../../services/spinner/spinner.service";
import {reloadPage} from "../../../../utils/reload.page";

@Component({
    selector: 'app-add-artifacts',
    templateUrl: './add-artifacts.component.html',
    styleUrls: ['./add-artifacts.component.scss']
})
export class AddArtifactsComponent implements OnInit {

    requirementForm?: FormGroup | null;
    artifactForm?: FormGroup | null;
    buttonDisabled: boolean = true;

    constructor(
        private requirementService: RequirementsService,
        private artifactService: ArtifactService,
        private alertService: AlertService,
        private dialog: MatDialog,
        private localStorageService: LocalStorageService,
        private richTextService: RichTextService,
        private spinnerService: SpinnerService,
        @Inject(MAT_DIALOG_DATA) public data: RequirementsDataModel) {

        console.log("DATA: ", data)
    }

    ngOnInit() {
        this.requirementService.currentForm.subscribe(form => {
            this.requirementForm = form;
            this.buttonDisabled = !(form?.valid && form?.value);
        });

        this.artifactService.currentForm.subscribe(form => {
            this.artifactForm = form;
            this.buttonDisabled = !(form?.valid && form?.value);
        });
    }

    async saveData(): Promise<void> {
        try {
            this.spinnerService.start();
            const response = await this.artifactService.createArtifact(this.prepareDataArtifact(this.data.id));
            if (response) {
                await this.alertService.toSuccessAlert("Artefato Cadastrado com sucesso!");
                this.localStorageService.removeItem('file');
                this.dialog.closeAll();
                this.spinnerService.stop();
                reloadPage();
                this.spinnerService.start();
            }
        } catch (error) {
            switch (error) {
                case 409:
                    console.error("ENTOU AQUI 409", error)
                    await this.alertService.toErrorAlert(
                        "Erro!",
                        "Já existe um artefato com esse nome e esse tipo vinculado a esse requisito!");
                    break;
                case 404:
                    console.error("ENTOU AQUI 404", error)
                    await this.alertService.toErrorAlert("Erro!", "Rota não encontrada ou fora!");
                    break;
                case 500:
                    console.error("ENTOU AQUI 500", error)
                    await this.alertService.toErrorAlert("Erro!", "Erro interno do servidor!");
                    break;
                default:
                    console.error("ENTOU AQUI OUTROS", error)
                    await this.alertService.toErrorAlert("Erro!", "Erro ao cadastrar artefato - " + error);
            }
        }
    }

    prepareDataRequirement() {
        if (this.requirementForm && this.requirementForm.valid) {

            return {
                ...this.requirementForm.value,
                creationDate: new Date().toISOString(),
                status: Status.CREATED
            };
        }
    }

    prepareDataArtifact(requirementId?: number) {

        const fileData = this.localStorageService.getItem('file');

        let descriptionValue: string = '';

        this.richTextService.currentContent.subscribe(content => {
            descriptionValue = content;
        })

        if (this.artifactForm && this.artifactForm.valid) {

            console.log("this.artifactForm.value: ", this.artifactForm.value)

            return {
                ...this.artifactForm.value,
                name: this.artifactForm.value.name,
                type: this.artifactForm.value.type,
                file: fileData,
                requirementId: requirementId,
                description: descriptionValue
            };
        }
    }

    close() {
        this.dialog.closeAll();
    }
}
