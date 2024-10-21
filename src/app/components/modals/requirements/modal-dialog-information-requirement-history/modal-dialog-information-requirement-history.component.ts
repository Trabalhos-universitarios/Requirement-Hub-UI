import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequirementsDataModel } from 'src/app/models/requirements-data-model';
import { Status } from 'src/app/utils/util.status';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-dialog-information-requirement-history',
  templateUrl: './modal-dialog-information-requirement-history.component.html',
  styleUrls: ['./modal-dialog-information-requirement-history.component.scss']
})
export class ModalDialogInformationRequirementHistoryComponent {

  parsedRelationsData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RequirementsDataModel,
    private sanitizer: DomSanitizer
  ) {

    if (data.relationsData && typeof data.relationsData === 'string') {
      this.parsedRelationsData = JSON.parse(data.relationsData);
    }
  }

  protected getStatusText(status: any): string {
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
        case Status.REJECTED:
            return 'Recusado';
        case Status.BLOCKED:
            return 'Bloqueado';
        case Status.IN_PROGRESS:
            return 'Em Progresso';
        case Status.IN_TEST:
            return 'Em Teste';
        case Status.IN_APPROVAL:
            return 'Em Aprovação';
        case Status.DONE:
            return 'Em Implantação';
        default:
            return 'Status desconhecido';
    }
  }

  protected sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
