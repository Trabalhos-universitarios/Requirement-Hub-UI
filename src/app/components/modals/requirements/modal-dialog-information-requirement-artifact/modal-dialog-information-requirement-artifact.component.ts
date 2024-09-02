import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ArtifactResponseModel } from 'src/app/models/artifact-response-model';
import { Status } from 'src/app/utils/util.status';

@Component({
  selector: 'app-modal-dialog-information-requirement-artifact',
  templateUrl: './modal-dialog-information-requirement-artifact.component.html',
  styleUrls: ['./modal-dialog-information-requirement-artifact.component.scss']
})
export class ModalDialogInformationRequirementArtifactComponent {

  fileJson: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ArtifactResponseModel,
              
  private sanitizer: DomSanitizer) {
    if(data.file != null){
      this.fileJson = JSON.parse(data.file);
    }   
  }

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
