import { Component } from '@angular/core';
import {Status} from "../../tables/projects/projecs-table/utils/status";

@Component({
  selector: 'app-modal-dialog-create-requirement',
  templateUrl: './modal-dialog-create-requirement.component.html',
  styleUrls: ['./modal-dialog-create-requirement.component.scss']
})
export class ModalDialogCreateRequirementComponent {

  buttonDisabled: boolean = false;

  getData() {
    console.log("Get requirements")
  }


  async saveData() {
    console.log("Save requirements")
  }

}
