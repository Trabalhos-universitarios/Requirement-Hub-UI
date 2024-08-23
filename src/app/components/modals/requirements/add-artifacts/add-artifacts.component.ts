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
import {RichTextService} from "../../../../services/richText/rich-text.service";

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

        // console.log("fileData: ", fileData)
        //
        // console.log("fileData type: ", typeof fileData)

        let descriptionValue: string = '';

        this.richTextService.currentContent.subscribe(content => {
            descriptionValue = content;
        })

        //todo parei aqui, buscar a description

        if (this.artifactForm && this.artifactForm.valid) {

            console.log("this.artifactForm.value: ", this.artifactForm.value)

            return {
                ...this.artifactForm.value,
                name: this.artifactForm.value.type.name,
                type: this.artifactForm.value.type.identifier,
                file: fileData,
                requirementId: requirementId,
                description: descriptionValue
            };
        }
    }

    async downloadFile() {
        try {
            const response = await this.artifactService.getArtifactByIdentifierArtifact(1);

            // Verifique se a resposta possui a estrutura esperada
            if (response && response.file) {
                // Converter a resposta para um objeto JSON
                const file = JSON.parse(response.file);

                console.log("file: ", file)

                // Verifique se o objeto `file` possui a propriedade `content`
                if (file && file.content) {
                    // Decodificar o conteúdo base64
                    const byteCharacters = atob(file.content.split(',')[1]);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);

                    // Criar um blob a partir do array de bytes
                    const blob = new Blob([byteArray], { type: file.type });

                    // Criar um link temporário para download
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = file.name;
                    link.click();

                    // Liberar o URL criado
                    URL.revokeObjectURL(link.href);
                } else {
                    console.error('O arquivo não contém a propriedade "content".');
                }
            } else {
                console.error('A resposta não contém o arquivo esperado.');
            }
        } catch (error) {
            console.error('Error downloading the file', error);
        }
    }
}
