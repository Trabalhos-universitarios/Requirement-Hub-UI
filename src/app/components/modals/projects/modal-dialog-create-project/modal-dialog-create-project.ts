import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {ReactiveFormServices} from "../../../../services/forms/reactive-form-services.service";
import {AlertService} from "../../../../services/sweetalert/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateProjectTabComponent} from "../../../tabs/create-project-tab/create-project-tab.component";
import {ProjectsService} from "../../../../services/projects/projects.service";
import {Status} from "../../../../utils/util.status";
import {RichTextService} from "../../../../services/richText/rich-text.service";
import {LocalStorageService} from "../../../../services/localstorage/local-storage.service";
import {SpinnerService} from "../../../../services/spinner/spinner.service";
import {reloadPage} from "../../../../utils/reload.page";


@Component({
    selector: 'app-modal-dialog-create-project',
    templateUrl: './modal-dialog-create-project.html',
    styleUrls: ['./modal-dialog-create-project.scss']
})
export class ModalDialogCreateProjectComponent implements OnInit {

    @ViewChild(CreateProjectTabComponent) tabComponent!: CreateProjectTabComponent;

    formGroup?: FormGroup | null;
    buttonDisabled: boolean = true;
    private descriptionProject: string = '';

    constructor(
        private reactiveFormService: ReactiveFormServices,
        private projectService: ProjectsService,
        private alertService: AlertService,
        private dialog: MatDialog,
        private richTextService: RichTextService,
        private localStorageService: LocalStorageService,
        private spinnerService: SpinnerService) {
    }


    ngOnInit() {
        this.reactiveFormService.currentForm.subscribe(form => {
            this.formGroup = form;
            this.buttonDisabled = !(form?.valid);
        });

        this.richTextService.currentContent.subscribe(content => {
            this.descriptionProject = content;
        });
    }

    async getData() {
        console.log("vai buscar um projeto por nome para não deixar criar repetido")
    }

    async saveData(): Promise<void> {
        this.spinnerService.start();
        try {
            const response = await this.projectService.createProject(this.prepareData());

            if (response) {
                await this.alertService.toSuccessAlert(`Projeto cadastrado com sucesso!`);
                this.localStorageService.removeItem('file');
                this.dialog.closeAll();
                this.spinnerService.stop()
                reloadPage()
            }
        } catch (error) {
            switch (error) {
                case 409:
                    console.log("ENTOU AQUI 409", error)
                    await this.alertService.toErrorAlert("Erro!", "Já existe um projeto com esse nome vinculado a esse gerente!");
                    break;
                case 404:
                    console.log("ENTOU AQUI 404", error)
                    await this.alertService.toErrorAlert("Erro!", "Rota não encontrada ou fora!");
                    break;
                case 500:
                    console.log("ENTOU AQUI 500", error)
                    await this.alertService.toErrorAlert("Erro!", "Erro interno do servidor!");
                    break;
                default:
                    console.log("ENTOU AQUI OUTROS", error)
                    await this.alertService.toErrorAlert("Erro!", "Erro ao cadastrar projeto - " + error);
            }
        } finally {
            this.spinnerService.stop();
        }
    }

    private prepareData() {
        if (this.formGroup && this.formGroup.valid) {
            return {
                ...this.formGroup.value,
                businessAnalysts: this.formGroup.value.businessAnalysts.map((v: { id: any; }) => v.id),
                commonUsers: this.formGroup.value.commonUsers.map((v: { id: any; }) => v.id),
                manager: this.formGroup.value.manager.name,
                requirementAnalysts: this.formGroup.value.requirementAnalysts.map((v: { id: any; }) => v.id),
                description: this.descriptionProject,
                status: Status.ACTIVE
            };
        }
    }
}

