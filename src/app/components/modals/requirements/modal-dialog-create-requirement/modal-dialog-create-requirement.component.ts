import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {RequirementsService} from "../../../../services/requirements/requirements.service";
import {AlertService} from "../../../../services/sweetalert/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {ArtifactService} from "../../../../services/requirements/artifacts/artifact.service";
import {LocalStorageService} from "../../../../services/localstorage/local-storage.service";
import {Status} from "../../../../utils/util.status";
import {ProjectsTableService} from "../../../../services/projects/projects-table.service";
import {RichTextService} from "../../../../services/richText/rich-text.service";

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
        private projectsTableService: ProjectsTableService,
        private richTextService: RichTextService,
        private alertService: AlertService,
        private dialog: MatDialog,
        private localStorageService: LocalStorageService) {
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
        this.getData();

        this.requirementService.createRequirements(this.prepareData()).subscribe(
            respReq => {
                if (respReq) {
                    this.alertService.toSuccessAlert(`Requisito ${respReq.identifier} cadastrado com sucesso!`);
                    this.dialog.closeAll();
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }
            },
            error => {
                if (error === 'Requisito já existe') {
                    this.alertService.toErrorAlert("Erro!", 'O requisito já existe no sistema.');
                } else {
                    this.alertService.toErrorAlert('Erro!','Ocorreu um erro ao cadastrar o requisito.');
                }
            }
        );
    }

    getData() {
        this.requirementService.getRequirements().then(posts => {
            for (let data of posts) {
            }
            // TODO AQUI TERÁ A LÓGICA PARA TRATAR SE O PROJETO JÁ EXISTIR NO BACK END
        });
    }

    private prepareData() {

        let descriptionValue: string = '';

            this.richTextService.currentContent.subscribe(content => {
                descriptionValue = content;
        })

        if (this.requirementForm?.value && this.requirementForm.valid) {
            return {
                ...this.requirementForm.value,
                effort: Number(this.requirementForm.value.effort),
                projectRelated: {id: this.projectsTableService.getCurrentProjectById()},
                author: this.localStorageService.getItem("id"),
                description: descriptionValue,
                stakeholders: this.requirementForm.value.stakeholders
                    .map((item: { id: number }) => ({id: item.id})),
                dependencies: this.requirementForm.value.dependencies
                    .map((item: { id: number }) => ({id: item.id})),
                responsible: this.requirementForm.value.responsible
                    .map((item: { id: number }) => ({id: item.id})),
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
                requirementId: requirementId // Inclui o ID do requisito
            };
        }
    }
}
