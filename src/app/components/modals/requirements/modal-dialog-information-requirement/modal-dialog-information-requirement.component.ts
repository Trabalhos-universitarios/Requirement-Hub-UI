import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {RequirementsDataModel} from 'src/app/models/requirements-data-model';
import {Status} from 'src/app/utils/util.status';
import {MatListModule} from '@angular/material/list';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-modal-dialog-information-requirement',
    templateUrl: './modal-dialog-information-requirement.component.html',
    styleUrls: ['./modal-dialog-information-requirement.component.scss']
})
export class ModalDialogInformationRequirementComponent {

    formGroup = this.formBuilder.group({
        comment: new FormControl('', Validators.minLength(20)),
    });
    public messages: { text: string, liked: boolean, emoji: string }[] = []; // Lista para armazenar mensagens, com informações de curtida e emoji
    public selectedMessageIndex: number = -1; // Índice da mensagem selecionada para adicionar emoji


    constructor(@Inject(MAT_DIALOG_DATA) public data: RequirementsDataModel,
                private formBuilder: FormBuilder,
                private sanitizer: DomSanitizer) {}

    // Método para lidar com o envio do formulário
    onSubmit() {
        if (this.formGroup.valid) {
            const comment = this.formGroup.get('comment')?.value;
            if (comment) {
                this.messages.push({ text: comment, liked: false, emoji: '' }); // Adiciona a mensagem com estado inicial de curtida e emoji
                this.formGroup.reset(); // Limpa o campo de comentário após o envio
            }
        }
    }

    // Método para curtir uma mensagem
    likeMessage(index: number) {
        this.messages[index].liked = !this.messages[index].liked; // Alterna o estado de curtida
    }

    // Método para adicionar um emoji
    addEmoji(index: number, emoji: string) {
        this.messages[index].emoji = emoji; // Adiciona o emoji à mensagem
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
