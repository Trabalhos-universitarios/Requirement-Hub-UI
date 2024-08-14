import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateArtifactProjectFormComponent } from 'src/app/components/forms/project/create-artifact-project-form/create-artifact-project-form.component';

@Component({
  selector: 'app-modal-dialog-artifacts-project',
  templateUrl: './modal-dialog-artifacts-project.component.html',
  styleUrls: ['./modal-dialog-artifacts-project.component.scss']
})
export class ModalDialogArtifactsProjectComponent {


  constructor(
   
    private dialog: MatDialog) {
  }

  close(){
    this.dialog.closeAll();
  }

  addData(){
    this.dialog.open(CreateArtifactProjectFormComponent);
  }

}
