import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ReactiveFormServices} from "../../../../services/forms/reactive-form-services.service";
import {FileItem, FileUploader} from "ng2-file-upload";
import {ThemeService} from "../../../../services/theme/theme.service";
import {LocalStorageService} from "../../../../services/local-storage.service";
import {ArtifactService} from "../../../../services/requirements/artifacts/artifact.service";

@Component({
  selector: 'app-create-artifact-form',
  templateUrl: './create-artifact-form.component.html',
  styleUrls: ['./create-artifact-form.component.scss']
})
export class CreateArtifactFormComponent {

  @ViewChild('fileInput') fileInput!: ElementRef;

  public formGroup: FormGroup = this.formBuilder.group({
    identifierArtifact: new FormControl(''),
    authorArtifact: new FormControl(''),
    typeArtifact: new FormControl(''),
    artifactDescription: new FormControl(''),
  });
  public uploader: FileUploader = new FileUploader({ url: '', itemAlias: 'file' });
  public hasBaseDropZoneOver: boolean = false;

  constructor(
      private formBuilder: FormBuilder,
      private artifactServices: ArtifactService,
      protected themeService: ThemeService,
      private localStorageService: LocalStorageService) {

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
      this.artifactServices.updateForm(this.formGroup);
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
}
