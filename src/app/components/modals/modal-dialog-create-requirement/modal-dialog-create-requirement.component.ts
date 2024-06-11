import {Component, OnInit} from '@angular/core';
import {Status} from "../../tables/projects/projecs-table/utils/status";
import {FormGroup} from "@angular/forms";
import {RequirementsService} from "../../../services/requirements/requirements.service";
import {AlertService} from "../../../services/sweetalert/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {ArtifactService} from "../../../services/requirements/artifacts/artifact.service";
import {LocalStorageService} from "../../../services/local-storage.service";

@Component({
    selector: 'app-modal-dialog-create-requirement',
    templateUrl: './modal-dialog-create-requirement.component.html',
    styleUrls: ['./modal-dialog-create-requirement.component.scss']
})
export class ModalDialogCreateRequirementComponent implements OnInit {

    requirementForm?: FormGroup | null;
    artifactForm?: FormGroup | null;
    buttonDisabled: boolean = true;

    constructor(
        private requirementService: RequirementsService,
        private artifactService: ArtifactService,
        private alertService: AlertService,
        private dialog: MatDialog,
        private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        this.requirementService.currentForm.subscribe(form => {
            this.requirementForm = form;
            this.buttonDisabled = !(form?.valid);
        });

        this.artifactService.currentForm.subscribe(form => {
            this.artifactForm = form;
            this.buttonDisabled = !(form?.valid);
        });
    }

    getData() {
        this.requirementService.getRequirements().subscribe(posts => {
            for (let data of posts) {
            }
            // TODO AQUI TERÁ A LÓGICA PARA TRATAR SE O PROJETO JÁ EXISTIR NO BACK END
        });
    }

    prepareData() {
        return {
            requirements: {},
            artifacts: {}
        }
    }

    async saveData(): Promise<void> {
        this.getData();

        this.prepareDataRequirement();

        this.requirementService.createRequirements(this.prepareDataRequirement()).subscribe(respReq => {
            if (respReq && respReq.id) {
                this.artifactService.createArtifact(this.prepareDataArtifact(respReq.id)).subscribe(respArt => {

                    console.log('respReq: ' + respReq);
                    console.log('respArt: ' + respArt);
                    
                    if (respReq && respArt) {
                        this.alertService.toSuccessAlert("Requisito Cadastrado com sucesso!");
                        this.localStorageService.clearAll();
                        // this.dialog.closeAll();
                        // setTimeout(() => {
                        //   window.location.reload();
                        // }, 3000);
                    }

                });
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

    prepareDataArtifact(requirementId?: string) {
        const fileData = JSON.parse(this.localStorageService.getItem('file'));
        if (this.artifactForm && this.artifactForm.valid) {
          return {
            ...this.artifactForm.value,
            creationDate: new Date().toISOString(),
            status: Status.CREATED,
            files: fileData,
            requirementId: requirementId // Inclui o ID do requisito
          };
        }
      } 

    async getIdRequirement(nameRequirement: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.requirementService.getRequirementsByName(nameRequirement).subscribe(
                resp => {
                    console.log("ID REQUIREMENT: " + resp.id);
                    resolve(resp);
                },
                err => {
                    reject(err);
                }
            );
        });
    }
}
