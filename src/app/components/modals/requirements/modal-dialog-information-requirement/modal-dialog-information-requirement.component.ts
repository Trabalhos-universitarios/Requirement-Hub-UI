import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {RequirementsDataModel} from 'src/app/models/requirements-data-model';
import {Status} from 'src/app/utils/util.status';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {
    RequirementHistoryTableComponent
} from 'src/app/components/tables/requirements/requirement-history-table/requirement-history-table.component';

@Component({
    selector: 'app-modal-dialog-information-requirement',
    templateUrl: './modal-dialog-information-requirement.component.html',
    styleUrls: ['./modal-dialog-information-requirement.component.scss']
})
export class ModalDialogInformationRequirementComponent {
    nameButtonSend: string = "Send";
    nameButtonClose: string = "Close";

    constructor(@Inject(MAT_DIALOG_DATA) public dataRequirement: RequirementsDataModel,
                private sanitizer: DomSanitizer,
                private matDialog: MatDialog) {}

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
            default:
                return 'Status desconhecido';
        }
    }

    protected sanitizeHtml(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    protected openHistory() {
        this.matDialog.open(RequirementHistoryTableComponent, {
            data: this.dataRequirement,
            width: '1200px',
            disableClose: true
        });
    }
}
