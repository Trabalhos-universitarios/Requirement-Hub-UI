import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateArtifactFormComponent } from 'src/app/components/forms/requirement/create-artifact-form/create-artifact-form.component';
import { ArtifactsRequirementsTableComponent } from 'src/app/components/tables/requirements/artifacts-requirements-table/artifacts-requirements-table.component';
import { RequirementsDataModel } from 'src/app/models/requirements-data-model';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';

@Component({
  selector: 'app-modal-dialog-artifacts-requirement',
  templateUrl: './modal-dialog-artifacts-requirement.component.html',
  styleUrls: ['./modal-dialog-artifacts-requirement.component.scss']
})
export class ModalDialogArtifactsRequirementComponent {

  constructor(
    private dialog: MatDialog,
    private localStorage: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: RequirementsDataModel,
    private dialogRef: MatDialogRef<ArtifactsRequirementsTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data2: any) {
  }
  
  close() {
     this.dialogRef.close();
  }
  
  addData(value: RequirementsDataModel) {
      this.dialog.open(CreateArtifactFormComponent, {
        data: value,
        disableClose: true
    });
  }
  
  isPermited() {
      return this.localStorage.getItem('role') != "GERENTE_DE_PROJETOS";
  }

}
