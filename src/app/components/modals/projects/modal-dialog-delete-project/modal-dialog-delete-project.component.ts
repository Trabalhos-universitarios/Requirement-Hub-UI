import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectsTableService } from 'src/app/services/projects/projects-table.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';

@Component({
  selector: 'app-modal-dialog-delete-project',
  templateUrl: './modal-dialog-delete-project.component.html',
  styleUrls: ['./modal-dialog-delete-project.component.scss']
})
export class ModalDialogDeleteProjectComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string },
              private projectsService : ProjectsService,
              private projectsTableService : ProjectsTableService) {}

  deleteProject() {
      this.projectsService.deleteProject(this.projectsTableService.getCurrentIdProject()).subscribe(() => {
      location.reload();
      });
  }
}
