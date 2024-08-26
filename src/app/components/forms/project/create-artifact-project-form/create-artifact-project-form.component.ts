import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {FileItem, FileUploader} from 'ng2-file-upload';
import {filter} from 'rxjs';
import {LocalStorageService} from 'src/app/services/localstorage/local-storage.service';
import {ArtifactProjectService} from 'src/app/services/projects/artifacts/artifact-project.service';
import {ProjectsTableService} from 'src/app/services/projects/projects-table.service';
import {AlertService} from 'src/app/services/sweetalert/alert.service';
import {ThemeService} from 'src/app/services/theme/theme.service';
import {SpinnerService} from "../../../../services/spinner/spinner.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'app-create-artifact-project-form',
    templateUrl: './create-artifact-project-form.component.html',
    styleUrls: ['./create-artifact-project-form.component.scss']
})
export class CreateArtifactProjectFormComponent implements OnInit {

    @ViewChild('fileInput') fileInput!: ElementRef;

    projectId?: number;
    formInvalid: boolean = true;

    public formGroup: FormGroup = this.formBuilder.group({
        name: new FormControl('', Validators.required),
    });
    public uploader: FileUploader = new FileUploader({url: '', itemAlias: 'file'});
    public hasBaseDropZoneOver: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private artifactProjectService: ArtifactProjectService,
        protected themeService: ThemeService,
        private localStorageService: LocalStorageService,
        private dialog: MatDialog,
        private alertService: AlertService,
        private projectsTableService: ProjectsTableService,
        private spinnerService: SpinnerService) {

        this.createForm();
        this.uploader.onAfterAddingFile = (file: FileItem) => {
            // Se já existir um arquivo na fila, remove-o antes de adicionar um novo
            if (this.uploader.queue.length > 1) {
                this.uploader.queue[0].remove();
            }
            file.withCredentials = false;
            this.simulateUploadProgress(file);
        };
    }

    ngOnInit() {
        this.artifactProjectService.currentForm
            .pipe(filter(form => !!form))
            .subscribe(form => {
                this.formGroup.patchValue(form.value);
            });

        this.formGroup.valueChanges.subscribe((f) => {
            this.formInvalid = this.formGroup.invalid;
        });
    }

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public selectFile() {
        this.clearFileInput(); // Limpa o campo antes de abrir o seletor de arquivos
        this.fileInput.nativeElement.click();
    }

    createForm() {
        this.formGroup.valueChanges.subscribe(val => {
            this.artifactProjectService.updateForm(this.formGroup);
        });
    }

    getStyles() {
        return this.themeService.isDarkMode()
            ? {
                'background-color': '#616161',
                'border-color': '#9E9E9E'
            }
            : {
                'background-color': '#EEEEEE',
                'border-color': '#BDBDBD'
            };
    }

    simulateUploadProgress(file: FileItem) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            file.progress = progress;
            if (progress >= 100) {
                clearInterval(interval);
                this.saveFileToLocalStorage(file);
            }
        }, 100);
    }

    saveFileToLocalStorage(file: FileItem) {
        const reader = new FileReader();
        reader.onload = (event: any) => {

            let fileType = file.file.type;
    
            if (!fileType && file.file && file.file.name) {
                // Se o tipo estiver vazio, obtenha a extensão do nome do arquivo
                const fileExtension = file.file.name.split('.').pop();
                fileType = fileExtension ? `application/${fileExtension}` : 'application/octet-stream';
            }
            
            const fileInfo = {
                fileName: file.file.name,
                size: file.file.size,
                type: fileType,
                contentBase64: event.target.result // Base64
            };
            this.localStorageService.setItem('file', fileInfo);
        };
        
        if (file._file) {
            reader.readAsDataURL(file._file);
        } else {
            console.error("File is undefined or not valid.");
        }
    }

    async saveData(): Promise<void> {
        try {
            this.spinnerService.start();
            this.projectId = this.projectsTableService.getCurrentProjectById();

            const response = await this.artifactProjectService.createArtifact(this.prepareDataArtifact(this.projectId));

            if (response) {
                await this.alertService.toSuccessAlert("Artefato Cadastrado com sucesso!");
                this.localStorageService.removeItem('file');
                this.dialog.closeAll();
            }
        } catch (error) {
            switch (error) {
                case 409:
                    console.error("ENTOU AQUI 409", error)
                    await this.alertService.toErrorAlert("Erro!", "Artefato já existe com esse nome!");
                    break;
                case 404:
                    console.error("ENTOU AQUI 404", error)
                    await this.alertService.toErrorAlert("Erro!", "Rota não encontrada ou fora!");
                    break;
                case 500:
                    console.error("ENTOU AQUI 500", error)
                    await this.alertService.toErrorAlert("Erro!", "Erro interno do servidor!");
                    break;
                default:
                    console.error("ENTOU AQUI OUTROS", error)
                    await this.alertService.toErrorAlert("Erro!", "Erro ao cadastrar artefato - " + error);
            }
        } finally {
            this.spinnerService.stop();
        }
    }

    prepareDataArtifact(projectId?: number) {
        const fileData = this.localStorageService.getItem('file');

        if (this.formGroup && this.formGroup.valid) {
            return {
                ...this.formGroup.value,
                fileName: fileData.fileName,
                size: fileData.size,
                type: fileData.type,
                contentBase64: fileData.contentBase64,
                projectId: projectId
            };
        }
    }

    close() {
        this.dialog.closeAll();
    }

    clearFileInput() {
        // Limpa o campo de entrada de arquivo
        this.fileInput.nativeElement.value = '';
    }

    removeFile(item: FileItem) {
        item.remove();
        this.localStorageService.removeItem('file');
    }
}
