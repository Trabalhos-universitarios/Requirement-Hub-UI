import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  CreateRequirementFormComponent
} from "../../forms/requirement/create-requirement-form/create-requirement-form.component";
import {
  ModalDialogCreateRequirementComponent
} from "../modal-dialog-create-requirement/modal-dialog-create-requirement.component";

@Component({
  selector: 'app-modal-dialog-informacoes-project',
  templateUrl: './modal-dialog-informacoes-project.component.html',
  styleUrls: ['./modal-dialog-informacoes-project.component.scss']
})
export class ModalDialogInformacoesProjectComponent {
  buttonDisabled: boolean = true;

  constructor(private dialog: MatDialog) {
  }

  getData() {
    console.log('CRIAR REQUISITO!')
  }

  async openCreateRequirement(): Promise<void> {
    this.dialog.closeAll();
    this.dialog.open(ModalDialogCreateRequirementComponent);
    console.log('CRIAR REQUISITO!')
  }
}
