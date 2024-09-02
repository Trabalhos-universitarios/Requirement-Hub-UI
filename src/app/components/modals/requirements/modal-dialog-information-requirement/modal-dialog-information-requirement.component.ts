import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequirementsDataModel } from 'src/app/models/requirements-data-model';
import { Status } from 'src/app/utils/util.status';
import {MatListModule} from '@angular/material/list';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-dialog-information-requirement',
  templateUrl: './modal-dialog-information-requirement.component.html',
  styleUrls: ['./modal-dialog-information-requirement.component.scss']
})
export class ModalDialogInformationRequirementComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: RequirementsDataModel,
  private sanitizer: DomSanitizer) {}

  getStatusText(status: any): string {
    switch (status) {
      case Status.ACTIVE:
        return 'Ativo';
      case Status.DRAFT:
        return 'Rascunho';
      case Status.PENDING:
        return 'Pendente';
      case Status.APPROVE:
        return 'Aprovado';
      case Status.CREATED:
        return 'Criado';
      case Status.REFUSE:
        return 'Recusado';
      default:
        return 'Status desconhecido';
    }
  }

  protected sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
}
}
