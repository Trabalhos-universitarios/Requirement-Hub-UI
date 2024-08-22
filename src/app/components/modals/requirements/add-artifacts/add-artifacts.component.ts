import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {RequirementsService} from "../../../../services/requirements/requirements.service";
import {ArtifactService} from "../../../../services/requirements/artifacts/artifact.service";
import {AlertService} from "../../../../services/sweetalert/alert.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {LocalStorageService} from "../../../../services/localstorage/local-storage.service";
import {Status} from "../../../../utils/util.status";
import {RequirementsDataModel} from "../../../../models/requirements-data-model";
import {Observable} from "rxjs";

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

        console.log("this.prepareDataArtifact(this.requirementId): ", this.prepareDataArtifact(this.data.id))

        this.artifactService.createArtifact(this.prepareDataArtifact(this.data.id)).subscribe(respArt => {

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

        //todo parei aqui, buscar a description

        if (this.artifactForm && this.artifactForm.valid) {
            return {
                ...this.artifactForm.value,
                file: fileData,
                requirementId: requirementId,
                description: this.artifactForm.value.description
            };
        }
    }

    closeDialog() {
        this.dialog.closeAll()
    }
}
