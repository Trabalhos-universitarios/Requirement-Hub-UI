import {Component, HostListener, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {RequirementsDataModel} from 'src/app/models/requirements-data-model';
import {Status} from 'src/app/utils/util.status';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {LocalStorageService} from "../../../../services/localstorage/local-storage.service";
import {CommentsService} from "../../../../services/comments-service/comments-service.service";
import { RequirementHistoryTableComponent } from 'src/app/components/tables/requirements/requirement-history-table/requirement-history-table.component';

@Component({
    selector: 'app-modal-dialog-information-requirement',
    templateUrl: './modal-dialog-information-requirement.component.html',
    styleUrls: ['./modal-dialog-information-requirement.component.scss']
})
export class ModalDialogInformationRequirementComponent {

    formGroup = this.formBuilder.group({
        comment: new FormControl('', Validators.minLength(20)),
    });
    public messages: { text: string, liked: boolean, emoji: string, user: { profilePicture: string | null } }[] = []; // Lista para armazenar mensagens, com informações de curtida, emoji e imagem do usuário
    public selectedMessageIndex: number = -1; // Índice da mensagem selecionada para adicionar emoji
    horario = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    showEmojiPicker = false;
    userInformation: any;
    placeholderDynamic: string = `Olá, ${this.localStorageService.getItem("name")}! Deixe seu comentário aqui...`;
    public commentsToShow: number = 5;


    constructor(@Inject(MAT_DIALOG_DATA) public data: RequirementsDataModel,
                private formBuilder: FormBuilder,
                private sanitizer: DomSanitizer,
                private localStorageService: LocalStorageService,
                private commentService: CommentsService,
                private matDialog: MatDialog) {}
    showEmojiPickerForCommentInput = false; // Variável para o novo picker de emoji no campo de comentário

    toggleEmojiPickerForCommentInput(event: Event) {
        event.stopPropagation(); // Evita o fechamento ao clicar no botão de emoji
        this.showEmojiPickerForCommentInput = !this.showEmojiPickerForCommentInput;
    }

    addEmojiToCommentInput(emoji: string) {
        const currentComment = this.formGroup.get('comment')?.value || '';
        this.formGroup.get('comment')?.setValue(currentComment + emoji);
        this.showEmojiPickerForCommentInput = false; // Fecha o picker após a seleção
    }

    isSendButtonVisible(): boolean | undefined {
        return this.formGroup.get('comment')?.valid && this.formGroup.get('comment')?.touched;
    }

    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event) {
        const targetElement = event.target as HTMLElement;
        if (targetElement && !targetElement.closest('.emoji-picker') && !targetElement.closest('.emoji-picker-input') && !targetElement.closest('.message-actions') && !targetElement.closest('.mat-form-field')) {
            this.showEmojiPicker = false; // Fecha o picker de emoji para mensagens se clicar fora
            this.showEmojiPickerForCommentInput = false; // Fecha o novo picker de emojis no campo de texto se clicar fora
        }
    }

    // Método para lidar com o envio do formulário
    onSubmit() {
        if (this.formGroup.valid) {
            const comment = this.formGroup.get('comment')?.value;

            console.log('comment: ', comment);

            if (comment) {
                this.messages.push({ text: comment, liked: false, emoji: '', user: { profilePicture: this.getUserProfilePicture() } }); // Adiciona a mensagem com estado inicial de curtida e emoji

                console.log('messages: ', this.messages);

                this.formGroup.reset(); // Limpa o campo de comentário após o envio
            }
        }
    }

    // Método que retorna a imagem do usuário ou nulo
    getUserProfilePicture(): string | null {
        this.userInformation = this.localStorageService.getItem("name");
        return this.localStorageService.getItem("image");
    }

    getUserInformation() {
        return `User: ${this.userInformation} \n Role: ${this.localStorageService.getItem("role")}`;
    }

    toggleEmojiPicker(index: number) {
        this.selectedMessageIndex = index;
        this.showEmojiPicker = !this.showEmojiPicker;
    }

    addEmoji(index: number, emoji: string) {
        if (index > -1 && this.messages[index]) {
            this.messages[index].emoji = emoji;
            this.showEmojiPicker = false; // Fechar o seletor de emoji após a seleção
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

    // @HostListener('document:click', ['$event'])
    // handleClickOutside(event: Event) {
    //     const targetElement = event.target as HTMLElement;
    //     if (targetElement && !targetElement.closest('.emoji-picker') && !targetElement.closest('.message-actions')) {
    //         this.showEmojiPicker = false; // Fecha o picker se clicar fora
    //     }
    // }

    // Função para carregar mais comentários
    loadMoreComments() {
        this.commentsToShow += 5; // Incrementa o número de comentários a serem exibidos em 5
    }

    openHistory(){
        this.matDialog.open(RequirementHistoryTableComponent, {
            data: this.data,
            width: '1200px',
            disableClose: true
          });
    }
}
