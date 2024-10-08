import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ModalDialogCreateProjectComponent} from "../../components/modals/projects/modal-dialog-create-project/modal-dialog-create-project";

@Component({
  selector: 'app-no-content',
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.scss']
})
export class NoContentComponent {

  constructor(private dialog: MatDialog) {
  }

  openCreateProjectComponent() {
    this.dialog.open(ModalDialogCreateProjectComponent);
  }
}
