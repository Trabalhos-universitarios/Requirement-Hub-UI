import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';
import { ArtifactProjectService } from 'src/app/services/projects/artifacts/artifact-project.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-create-artifact-project-form',
  templateUrl: './create-artifact-project-form.component.html',
  styleUrls: ['./create-artifact-project-form.component.scss']
})
export class CreateArtifactProjectFormComponent {

  @ViewChild('fileInput') fileInput!: ElementRef;

    public formGroup: FormGroup = this.formBuilder.group({
        name: new FormControl(''),
    });
    public uploader: FileUploader = new FileUploader({url: '', itemAlias: 'file'});
    public hasBaseDropZoneOver: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private artifactProjectServices: ArtifactProjectService,
        protected themeService: ThemeService,
        private localStorageService: LocalStorageService,
        private dialog: MatDialog) {

        this.createForm();
        this.uploader.onAfterAddingFile = (file: FileItem) => {
            file.withCredentials = false;
            this.simulateUploadProgress(file);
        };
    }

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public selectFile() {
        this.fileInput.nativeElement.click();
    }

    createForm() {
        this.formGroup.valueChanges.subscribe(val => {
            this.artifactProjectServices.updateForm(this.formGroup);
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
                name: file.file.name,
                size: file.file.size,
                type: file.file.type,
                content: event.target.result // Base64
            };
            this.localStorageService.setItem('file', JSON.stringify(fileInfo));
        };
        reader.readAsDataURL(file._file);
    }

    saveData(){
        
    }

    close(){
        this.dialog.closeAll();
      }

}
