import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {FileItem, FileUploader} from "ng2-file-upload";
import {ThemeService} from "../../../../services/theme/theme.service";
import {LocalStorageService} from "../../../../services/localstorage/local-storage.service";
import {ArtifactService} from "../../../../services/requirements/artifacts/artifact.service";
import {RequirementsDataModel} from "../../../../models/requirements-data-model";
import e from "express";
import {interval} from "rxjs";

@Component({
    selector: 'app-create-artifact-form',
    templateUrl: './create-artifact-form.component.html',
    styleUrls: ['./create-artifact-form.component.scss']
})
export class CreateArtifactFormComponent implements OnInit {

    @ViewChild('fileInput') fileInput!: ElementRef;
    @Input() dataRequirementToTableRequirement: RequirementsDataModel | undefined;

    public formGroup: FormGroup = this.formBuilder.group({
        name: new FormControl({value: "", disabled: true}),
        author: new FormControl(''),
        type: new FormControl(''),
        description: new FormControl(''),
    });
    public uploader: FileUploader = new FileUploader({url: '', itemAlias: 'file'});
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

    ngOnInit(): void {
        this.formGroup.patchValue({name: this.dataRequirementToTableRequirement?.name});
        console.log("DATA EM CREATE ARTIFACT: ", this.dataRequirementToTableRequirement)
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
