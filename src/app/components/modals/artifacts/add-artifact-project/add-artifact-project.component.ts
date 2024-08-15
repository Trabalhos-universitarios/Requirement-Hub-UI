import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProjectDataModel } from 'src/app/models/project-data-model';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';
import { ArtifactProjectService } from 'src/app/services/projects/artifacts/artifact-project.service';
import { ProjectsTableService } from 'src/app/services/projects/projects-table.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { AlertService } from 'src/app/services/sweetalert/alert.service';


@Component({
  selector: 'app-add-artifact-project',
  templateUrl: './add-artifact-project.component.html',
  styleUrls: ['./add-artifact-project.component.scss']
})
export class AddArtifactProjectComponent {

  projectForm?: FormGroup | null;
    projectId?: number;
    artifactForm?: FormGroup | null;
    buttonDisabled: boolean = true;

    constructor(
        private projectsTableService: ProjectsTableService,
        private projectsService: ProjectsService,
        private artifactProjectService: ArtifactProjectService,
        private alertService: AlertService,
        private dialog: MatDialog,
        private localStorageService: LocalStorageService,
        ) {
    }

    ngOnInit() {
        this.projectsService.currentForm.subscribe(form => {
            this.projectForm = form;
            this.buttonDisabled = !(form?.valid && form?.value);
        });

        this.artifactProjectService.currentForm.subscribe(form => {
            this.artifactForm = form;
            this.buttonDisabled = !(form?.valid && form?.value);
        });
    }

    async saveData(): Promise<void> {

        //let verifyArtifactExists = await this.getArtifactByIdentifierArtifact()

        //if (verifyArtifactExists) {
            //await this.alertService.toErrorAlert("ERRO", "Esse artefato já está registrado!")
            //return;
        //}

        this.projectId = this.projectsTableService.getCurrentIdProject()

        this.artifactProjectService.createArtifact(this.prepareDataArtifact(this.projectId)).subscribe(respArt => {

            try {
                this.alertService.toSuccessAlert("Artefato Cadastrado com sucesso!");
                //this.localStorageService.clearAll();
                //this.dialog.closeAll();
                setTimeout(() => {
                    //window.location.reload();
                }, 2000);
            } catch (error) {
                throw new Error(`Exception caused ${error} and api response id ${respArt}`);
            }
        });

    }

    getData() {
        this.projectsService.getProjects().subscribe(posts => {
            for (let data of posts) {
            }
            // TODO AQUI TERÁ A LÓGICA PARA TRATAR SE O PROJETO JÁ EXISTIR NO BACK END
        });
    }

    prepareDataArtifact(projectId?: number) {
        const fileData = this.localStorageService.getItem('file');

        if (this.artifactForm && this.artifactForm.valid) {
            return {
                ...this.artifactForm.value,
                creationDate: new Date().toISOString(),
                files: fileData,
                projectId: projectId
            };
        }
    }

    closeDialog() {
        this.dialog.closeAll()
    }

}
