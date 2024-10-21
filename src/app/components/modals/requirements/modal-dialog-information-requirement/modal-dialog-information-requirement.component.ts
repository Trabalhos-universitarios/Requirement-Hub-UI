import {Component, HostListener, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {RequirementsDataModel} from 'src/app/models/requirements-data-model';
import {Status} from 'src/app/utils/util.status';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {
    RequirementHistoryTableComponent
} from 'src/app/components/tables/requirements/requirement-history-table/requirement-history-table.component';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {
    CommentsReactionsModel,
    ReactionsResponseModel,
    SearchCommentsMessagesModel
} from "../../../../models/comments-model";
import {LocalStorageService} from "../../../../services/localstorage/local-storage.service";
import {CommentsService} from "../../../../services/comments-service/comments-service.service";
import {SpinnerService} from "../../../../services/spinner/spinner.service";
import {AlertService} from "../../../../services/sweetalert/alert.service";
import {ThemeService} from "../../../../services/theme/theme.service";
import {isExceptionType} from "../../../../utils/exceptions-utils";

@Component({
    selector: 'app-modal-dialog-information-requirement',
    templateUrl: './modal-dialog-information-requirement.component.html',
    styleUrls: ['./modal-dialog-information-requirement.component.scss']
})
export class ModalDialogInformationRequirementComponent implements OnInit {
    protected formGroup = this.formBuilder.group({

        comment: new FormControl('', [
            Validators.minLength(20),
            Validators.maxLength(2000), Validators.required
        ]),
    });
    protected getCommentsList: SearchCommentsMessagesModel[] = [];
    protected getCommentsUsersInformation: any;
    protected selectedMessageIndex: number = -1;
    protected showEmojiPicker = false;
    protected userInformation: any;
    protected placeholderDynamic: string = `Olá, ${this.localStorageService.getItem("name")}! Deixe seu comentário aqui...`;
    protected isSendButtonDisable: boolean = true;
    protected showEmojiPickerForCommentInput = false;
    protected characterCount: number = 0;
    @Input() newComment: SearchCommentsMessagesModel[] = [];

    constructor(@Inject(MAT_DIALOG_DATA) public dataRequirement: RequirementsDataModel,
                private formBuilder: FormBuilder,
                private sanitizer: DomSanitizer,
                private localStorageService: LocalStorageService,
                private commentService: CommentsService,
                private matDialog: MatDialog,
                private spinnerService: SpinnerService,
                private alertService: AlertService,
                private themeService: ThemeService) {}

    ngOnInit(): void {
        this.getCommentsAddBubbles().then();
        this.formGroup.valueChanges.subscribe(() => {
            this.isSendButtonDisable = !this.formGroup.valid;
        });
    }

    protected isDarkTheme() {
        return this.themeService.isDarkMode();
    }

    @HostListener('document:click', ['$event'])
    public handleClickOutside(event: Event) {
        const targetElement = event.target as HTMLElement;
        if (targetElement && !targetElement.closest('.emoji-picker') && !targetElement.closest('.emoji-picker-input') && !targetElement.closest('.message-actions') && !targetElement.closest('.mat-form-field')) {
            this.showEmojiPicker = false;
            this.showEmojiPickerForCommentInput = false;
        }
    }

    private async getCommentsAddBubbles() {
        this.spinnerService.start();
        let response = await this.commentService.getCommentsByRequirement(this.dataRequirement.id).then()

        if (response.length > 0) {
            response.forEach(comment => {
                const dateCreated = comment.dateCreated ? new Date(comment.dateCreated) : null;
                const hour = dateCreated ? dateCreated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                const date = dateCreated ? dateCreated.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

                this.getCommentsList.push({
                    id: comment.id,
                    description: comment.description,
                    requirementId: comment.requirementId,
                    dateCreated: date,
                    hourCreated: hour,
                    reactions: comment.reactions,
                    userId: comment.userId,
                    userImage: comment.userImage,
                    userName: comment.userName,
                    userRole: comment.userRole,
                });
                this.spinnerService.stop()
            })
        } else {
            this.spinnerService.stop()
        }
    }

    protected toggleEmojiPickerForCommentInput(event: Event) {
        event.stopPropagation();
        this.showEmojiPickerForCommentInput = !this.showEmojiPickerForCommentInput;
    }

    protected addEmojiToCommentInput(emoji: string) {
        const currentComment = this.formGroup.get('comment')?.value || '';
        this.formGroup.get('comment')?.setValue(currentComment + emoji);
        this.showEmojiPickerForCommentInput = false;
    }

    protected async saveData() {
        try {
            if (this.formGroup.valid) {
                const comment = this.formGroup.get('comment')?.value;
                if (comment && this.dataRequirement.id) {
                    this.spinnerService.start();
                    const response = await this.commentService.addComment(this.prepareData(comment)).then();
                    const dateCreated = response.dateCreated ? new Date(response.dateCreated) : null;
                    const hour = dateCreated ? dateCreated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                    const date = dateCreated ? dateCreated.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

                    this.newComment.push({
                        id: response.id,
                        description: response.description,
                        requirementId: response.requirementId,
                        dateCreated: date,
                        hourCreated: hour,
                        userId: response.userId,
                        userImage: response.userImage,
                        userName: response.userName,
                        userRole: response.userRole,
                        reactions: []
                    })

                    if (response) {
                        await this.alertService.toSuccessAlert("Comentário adicionado com sucesso!");
                        this.spinnerService.stop();
                    }
                    this.getCommentsList.push({
                        id: response.id,
                        description: comment,
                        dateCreated: date,
                        hourCreated: hour,
                        requirementId: {id: this.dataRequirement.id},
                        userId: {id: this.localStorageService.getItem("id")},
                        userImage: this.getUserProfilePicture() || '',
                        userName: this.localStorageService.getItem("name"),
                        userRole: this.localStorageService.getItem("role"),
                        reactions: []
                    });
                    this.formGroup.reset();
                }
            }
        } catch (error) {
            this.spinnerService.stop();
            await isExceptionType(this.alertService, error, "", "alert");
        }
    }

    private prepareData(comment: string) {
        return {
            description: comment,
            requirement: {id: this.dataRequirement.id},
            user: {id: this.localStorageService.getItem("id")},
            avatarUser: this.getUserProfilePicture() || '',
            reactions: []
        };
    }

    protected getUsersByReaction(emoji: string, reactions: any[]): string {
        const users = reactions
            .filter((reaction) => reaction.emoji === emoji)
            .map((reaction) => {
                if (typeof reaction.userId === 'number') {
                    const userName = this.localStorageService.getItem('name');
                    return userName ? userName : 'Usuário desconhecido';
                }
                return reaction.userId ? reaction.userId : 'Usuário desconhecido';
            });

        return users.join(' - ');
    }

    protected getUniqueEmojis(reactions: ReactionsResponseModel[]): string[] {
        const emojis = reactions.map(reaction => reaction.emoji);
        return Array.from(new Set(emojis));
    }

    protected countReactionsByEmoji(emoji: string, reactions: { userId: string; emoji: string }[]): number {
        return reactions.filter(reaction => reaction.emoji === emoji).length;
    }

    private getUserProfilePicture(): string | null {
        this.userInformation = this.localStorageService.getItem("name");
        return this.localStorageService.getItem("image");
    }

    protected addReactionInMessage(index: number) {
        this.selectedMessageIndex = index;
        this.showEmojiPicker = !this.showEmojiPicker;
    }

    protected async addEmoji(index: number, emoji: string) {

        try {
            if (index > -1 && this.getCommentsList[index]) {
                this.spinnerService.start();

                const response = await this.commentService.addReaction(this.getCommentsList[index].id, this.prepareDataReaction(emoji)).then();

                if (response) {
                    await this.alertService.toSuccessAlert("Reação adicionada com sucesso!");
                    this.verifyIfAddReactionUserRepeat(index, emoji);
                    this.showEmojiPicker = false;
                    this.spinnerService.stop();
                }
            } else if (this.newComment[index]) {
                this.spinnerService.start();

                const response = await this.commentService.addReaction(this.newComment[index].id, this.prepareDataReaction(emoji)).then();

                if (response) {
                    await this.alertService.toSuccessAlert("Reação adicionada com sucesso!");
                    this.showEmojiPicker = false;
                    this.spinnerService.stop();
                }
            }
        } catch (error) {
            this.spinnerService.stop();
            await isExceptionType(this.alertService, error, "");
        }
    }

    private verifyIfAddReactionUserRepeat(index: number, emoji: string) {
        const currentUserId = this.localStorageService.getItem("id");

        let existingReaction = this.getCommentsList[index].reactions
            .find(reaction => +reaction.userId === currentUserId);

        if (existingReaction) {
            this.getCommentsList[index].reactions
                .splice(0, 1, {
                    commentId: existingReaction.commentId,
                    userId: currentUserId,
                    emoji: emoji
                });
        } else {
            this.getCommentsList[index].reactions.push({
                commentId: this.getCommentsList[index].id,
                userId: currentUserId,
                emoji
            });
        }
    }

    private prepareDataReaction(emoji: string): CommentsReactionsModel {
        return {
            user: {id: this.localStorageService.getItem("id")},
            reactions: {reaction: emoji}
        };
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

    protected openHistory() {
        this.matDialog.open(RequirementHistoryTableComponent, {
            data: this.dataRequirement,
            width: '1200px',
            disableClose: true
        });
    }

    protected updateCharacterCount(): void {
        const commentControl = this.formGroup.get('comment');
        this.characterCount = commentControl?.value?.length ?? 0;
    }

    protected async deleteComment(i: any) {
        const result = await this.alertService.toOptionalActionAlert(
            "Deletar comentário",
            "Deseja realmente excluir o comentário?",
            "Sim, deletar!"
        );

        if (result.isConfirmed) {
            this.spinnerService.start();
            let response = await this.commentService.deleteCommentById(this.getCommentsList[i].id).then();
            if (response) {
                await this.alertService.toSuccessAlert("Comentário excluído com sucesso!");
            }
            this.getCommentsList.splice(i, 1);
            this.spinnerService.stop();
        }
    }

    protected verifyRole() {
        return !(this.localStorageService.getItem("role") === "GERENTE_DE_PROJETOS" || this.localStorageService.getItem("role") === "ADMIN");
    }
}
