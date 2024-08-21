import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {RequirementsService} from "../../../../services/requirements/requirements.service";
import {ArtifactService} from "../../../../services/requirements/artifacts/artifact.service";
import {AlertService} from "../../../../services/sweetalert/alert.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {LocalStorageService} from "../../../../services/localstorage/local-storage.service";
import {Status} from "../../../../utils/util.status";
import {RequirementsDataModel} from "../../../../models/requirements-data-model";

@Component({
    selector: 'app-add-artifacts',
    templateUrl: './add-artifacts.component.html',
    styleUrls: ['./add-artifacts.component.scss']
})
export class AddArtifactsComponent implements OnInit {

    requirementForm?: FormGroup | null;
    requirementId?: RequirementsDataModel[];
    artifactForm?: FormGroup | null;
    buttonDisabled: boolean = true;

    constructor(
        private requirementService: RequirementsService,
        private artifactService: ArtifactService,
        private alertService: AlertService,
        private dialog: MatDialog,
        private localStorageService: LocalStorageService,
        @Inject(MAT_DIALOG_DATA) public data: { identifierRequirement: string }) {

        console.log("DATA EM ADD ARTIFACT: ", data)

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
        let verifyArtifactExists = await this.getArtifactByIdentifierArtifact()
        if (verifyArtifactExists) {
            await this.alertService.toErrorAlert("ERRO", "Esse artefato já está registrado!")
            return;
        }
        this.requirementId = await this.getRequirementId();
        this.artifactService.createArtifact(this.prepareDataArtifact(this.requirementId[0].id)).subscribe(respArt => {
            try {
                this.alertService.toSuccessAlert("Requisito Cadastrado com sucesso!");
                //this.localStorageService.clearAll();
                //this.dialog.closeAll();
                setTimeout(() => {
                    //window.location.reload();
                }, 3000);
            } catch (error) {
                throw new Error(`Exception caused ${error} and api response id ${respArt}`);
            }
        });

    }

    //TODO PAREI AQUI, BUSCAR O ARTEFATO PARA VER SE NÃO EXISTE ANTES DE SALVAR.
    async getArtifactByIdentifierArtifact() {
        return await this.artifactService.getArtifactByIdentifierArtifact(this.artifactForm?.value.identifierArtifact)
    }

    async getRequirementId(): Promise<RequirementsDataModel[]> {
        return await this.requirementService.getRequirementsByIdentifier(this.data.identifierRequirement)
    }

    getData() {
        this.requirementService.getAllRequirements().then(posts => {
            for (let data of posts) {
            }
            // TODO AQUI TERÁ A LÓGICA PARA TRATAR SE O PROJETO JÁ EXISTIR NO BACK END
        });
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

    closeDialog() {
        this.dialog.closeAll()
    }
}
