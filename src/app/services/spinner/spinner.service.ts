import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SpinnerComponent} from "../../shared/spinner/spinner.component";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private dialogRef: MatDialogRef<SpinnerComponent> | null = null;

  constructor(private dialog: MatDialog) {}

  start(): void {
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(SpinnerComponent, {
        disableClose: true,
        width: '350px',
        height: '350px',
        panelClass: 'spinner-dialog'
      });
    }
  }

  stop(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }
}
