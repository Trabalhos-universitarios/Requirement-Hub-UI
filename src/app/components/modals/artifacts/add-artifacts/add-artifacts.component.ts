import { Component } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {RequirementsService} from "../../../../services/requirements/requirements.service";
import {ArtifactService} from "../../../../services/requirements/artifacts/artifact.service";
import {AlertService} from "../../../../services/sweetalert/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {LocalStorageService} from "../../../../services/localstorage/local-storage.service";
import {Status} from "../../../../utils/util.status";

@Component({
  selector: 'app-add-artifacts',
  templateUrl: './add-artifacts.component.html',
  styleUrls: ['./add-artifacts.component.scss']
})
export class AddArtifactsComponent {

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
      this.buttonDisabled = !(form?.valid && form?.value);
    });

    this.artifactService.currentForm.subscribe(form => {
      this.artifactForm = form;
      this.buttonDisabled = !(form?.valid && form?.value);
    });
  }

  async saveData(): Promise<void> {
    this.getData();

    this.prepareDataRequirement();

    this.requirementService.createRequirements(this.prepareDataRequirement()).subscribe(respReq => {

      if (respReq && respReq.id) {
        this.artifactService.createArtifact(this.prepareDataArtifact(respReq.id)).subscribe(respArt => {

          console.log('respReq: ' + respReq);
          console.log('respArt: ' + respArt);

          if (respReq) {
            this.alertService.toSuccessAlert("Requisito Cadastrado com sucesso!");
            this.localStorageService.clearAll();
            this.dialog.closeAll();
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        });
      }
    });
  }

  getData() {
    this.requirementService.getRequirements().subscribe(posts => {
      for (let data of posts) {
      }
      // TODO AQUI TERÁ A LÓGICA PARA TRATAR SE O PROJETO JÁ EXISTIR NO BACK END
    });
  }

  prepareDataRequirement() {
    if (this.requirementForm && this.requirementForm.valid) {

      console.log('TESTANDO DESCRICAO: ', this.requirementForm.value);

      return {
        ...this.requirementForm.value,
        creationDate: new Date().toISOString(),
        status: Status.CREATED
      };
    }
  }

  prepareDataArtifact(requirementId?: string) {
    const fileData = this.localStorageService.getItem('file');
    if (this.artifactForm && this.artifactForm.valid) {
      let data = {
        ...this.artifactForm.value,
        creationDate: new Date().toISOString(),
        status: Status.CREATED,
        files: fileData,
        requirementId: requirementId // Inclui o ID do requisito
      };
      console.log('ARTIFACT INDO PARA O BACK: ' + data)
      return data;
    }
  }

  closeDialog() {
    this.dialog.closeAll()
  }
}
