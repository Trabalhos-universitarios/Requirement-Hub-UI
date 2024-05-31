import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ModalDialogComponent} from "../modal-dialog/modal-dialog.component";

@Component({
  selector: 'app-no-content',
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.scss']
})
export class NoContentComponent {

  constructor(private dialog: MatDialog) {
  }

  openCreateProjectComponent() {
    this.dialog.open(ModalDialogComponent);
  }
}
