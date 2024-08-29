import {Component, Inject} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {RequirementsService} from "../../../../services/requirements/requirements.service";
import {ArtifactService} from "../../../../services/requirements/artifacts/artifact.service";
import {ProjectsTableService} from "../../../../services/projects/projects-table.service";
import {RichTextService} from "../../../../services/richText/rich-text.service";
import {AlertService} from "../../../../services/sweetalert/alert.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {LocalStorageService} from "../../../../services/localstorage/local-storage.service";
import {SpinnerService} from "../../../../services/spinner/spinner.service";
import {reloadPage} from "../../../../utils/reload.page";
import {Status} from "../../../../utils/util.status";
import {RequirementsDataModel} from "../../../../models/requirements-data-model";

@Component({
  selector: 'app-modal-dialog-update-requirement',
  templateUrl: './modal-dialog-update-requirement.component.html',
  styleUrls: ['./modal-dialog-update-requirement.component.scss']
})
export class ModalDialogUpdateRequirementComponent {

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
      private localStorageService: LocalStorageService,
      private spinnerService: SpinnerService,
      @Inject(MAT_DIALOG_DATA) public data: RequirementsDataModel) {}

  //todo parei aqui, aplicando trataiva de erros e spinner no requisito

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

      console.log("DATA", this.data)
      console.log("this.requirementForm?.value: ", this.requirementForm?.value)

      //TODO PAREI AQUI TENTANDO ATUALIZAR O REQUISITO

      const response = await this.requirementService.createRequirements(this.prepareData()).then(response => response.identifier);

      if (response) {
        await this.alertService.toSuccessAlert(`Reququisito ${response} cadastrado com sucesso!`);
        this.localStorageService.removeItem('file');
        this.dialog.closeAll();
        this.spinnerService.start();
        reloadPage()
      }
    } catch (error) {
      switch (error) {
        case 409:
          console.log("ENTOU AQUI 409", error)
          await this.alertService.toErrorAlert("Erro!", "Já existe um requisito com esse nome vinculado a esse projeto!");
          break;
        case 404:
          console.log("ENTOU AQUI 404", error)
          await this.alertService.toErrorAlert("Erro!", "Rota não encontrada ou fora!");
          break;
        case 500:
          console.log("ENTOU AQUI 500", error)
          await this.alertService.toErrorAlert("Erro!", "Erro interno do servidor!");
          break;
        default:
          console.log("ENTOU AQUI OUTROS", error)
          await this.alertService.toErrorAlert("Erro!", "Erro ao cadastrar requisito - " + error);
      }
    }
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
        requirementId: requirementId // Inclui o ID do requisito
      };
    }
  }

  close() {
    this.dialog.closeAll();
  }
}
