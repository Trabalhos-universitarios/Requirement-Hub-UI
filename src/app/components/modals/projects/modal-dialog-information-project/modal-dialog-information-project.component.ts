import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  ModalDialogCreateRequirementComponent
} from "../../requirements/modal-dialog-create-requirement/modal-dialog-create-requirement.component";
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';

@Component({
  selector: 'app-modal-dialog-information-project',
  templateUrl: './modal-dialog-information-project.component.html',
  styleUrls: ['./modal-dialog-information-project.component.scss']
})
export class ModalDialogInformationProjectComponent {

  constructor(private dialog: MatDialog,
              private localStorage: LocalStorageService) {
  }

  getData() {
  }

  async openCreateRequirement(): Promise<void> {
    this.dialog.closeAll();
    this.dialog.open(ModalDialogCreateRequirementComponent);
  }

  isPermited() {
    if (this.localStorage.getItem('role') == "GERENTE_DE_PROJETOS" ||
        this.localStorage.getItem('role') == "ANALISTA_DE_REQUISITOS" ||
        this.localStorage.getItem('role') == "ANALISTA_DE_NEGOCIO") {
        return false;
    }
    return true;
}

  close() {
    this.dialog.closeAll();
  }
}
