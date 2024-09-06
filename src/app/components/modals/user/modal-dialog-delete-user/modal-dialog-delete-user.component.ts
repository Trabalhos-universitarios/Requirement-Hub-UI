import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-dialog-delete-user',
  templateUrl: './modal-dialog-delete-user.component.html',
  styleUrls: ['./modal-dialog-delete-user.component.scss']
})
export class ModalDialogDeleteUserComponent {


  constructor(

    private dialog: MatDialog,
  ) {}

  close() {
    this.dialog.closeAll();
  }

}
