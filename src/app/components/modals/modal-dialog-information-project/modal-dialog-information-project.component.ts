import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  ModalDialogCreateRequirementComponent
} from "../modal-dialog-create-requirement/modal-dialog-create-requirement.component";

@Component({
  selector: 'app-modal-dialog-information-project',
  templateUrl: './modal-dialog-information-project.component.html',
  styleUrls: ['./modal-dialog-information-project.component.scss']
})
export class ModalDialogInformationProjectComponent {

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
