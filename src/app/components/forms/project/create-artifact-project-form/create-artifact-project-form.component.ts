import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { filter } from 'rxjs';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';
import { ArtifactProjectService } from 'src/app/services/projects/artifacts/artifact-project.service';
import { ProjectsTableService } from 'src/app/services/projects/projects-table.service';
import { AlertService } from 'src/app/services/sweetalert/alert.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-create-artifact-project-form',
  templateUrl: './create-artifact-project-form.component.html',
  styleUrls: ['./create-artifact-project-form.component.scss']
})
export class CreateArtifactProjectFormComponent implements OnInit {

    @ViewChild('fileInput') fileInput!: ElementRef;

    projectId?: number;
    buttonDisabled: boolean = true;

    public formGroup: FormGroup = this.formBuilder.group({
        name: new FormControl(''),
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
        private projectsTableService: ProjectsTableService) {

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
                this.buttonDisabled = !(this.formGroup.valid && this.formGroup.value);
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
        }, 150);
    }

    saveFileToLocalStorage(file: FileItem) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
            const fileInfo = {
                fileName: file.file.name,
                size: file.file.size,
                type: file.file.type,
                contentBase64: event.target.result // Base64
            };
            this.localStorageService.setItem('file', fileInfo);
        };
        reader.readAsDataURL(file._file);
    }

    async saveData(): Promise<void> {
        this.projectId = this.projectsTableService.getCurrentIdProject();
        console.log(this.projectId);

        this.artifactProjectService.createArtifact(this.prepareDataArtifact(this.projectId)).subscribe(respArt => {
            try {
                this.alertService.toSuccessAlert("Artefato Cadastrado com sucesso!");
                this.localStorageService.removeItem('file');
                this.dialog.closeAll();
            } catch (error) {
                throw new Error(`Exception caused ${error} and api response id ${respArt}`);
            }
        });
    }

    prepareDataArtifact(projectId?: number) {
        const fileData = this.localStorageService.getItem('file');
        console.log(fileData);

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
}
