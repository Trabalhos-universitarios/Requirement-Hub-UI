import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {FileItem, FileUploader} from "ng2-file-upload";
import {ThemeService} from "../../../../services/theme/theme.service";
import {LocalStorageService} from "../../../../services/localstorage/local-storage.service";
import {ArtifactService} from "../../../../services/requirements/artifacts/artifact.service";
import {RequirementsDataModel} from "../../../../models/requirements-data-model";
import {ARTIFACT_TYPE_LIST} from "../../../../utils/artifact-type-list-util";
import {CapitalizeFirstPipePipe} from "../../../../pipes/capitalize-first-pipe.pipe";

@Component({
    selector: 'app-create-artifact-form',
    templateUrl: './create-artifact-form.component.html',
    styleUrls: ['./create-artifact-form.component.scss']
})
export class CreateArtifactFormComponent implements OnInit {

    @ViewChild('fileInput') fileInput!: ElementRef;
    @Input() dataRequirementToTableRequirement: RequirementsDataModel | undefined;
    protected readonly ARTIFACT_TYPE_LIST = ARTIFACT_TYPE_LIST;

    public formGroup: FormGroup = this.formBuilder.group({
        name: new FormControl({value: '', disabled: true}),
        author: new FormControl({value: '', disabled: true}),
        type: new FormControl(''),
        description: new FormControl(''),
    });
    protected uploader: FileUploader = new FileUploader({url: '', itemAlias: 'file'});
    protected hasBaseDropZoneOver: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private artifactServices: ArtifactService,
        protected themeService: ThemeService,
        private localStorageService: LocalStorageService,
        private capitalizeFirstPipe: CapitalizeFirstPipePipe) {

        this.createForm();
        this.uploader.onAfterAddingFile = (file: FileItem) => {
            file.withCredentials = false;
            this.simulateUploadProgress(file);
        };
    }

    public ngOnInit(): void {
        this.formGroup.patchValue(
            {
                name: this.dataRequirementToTableRequirement?.name,
                author: this.capitalizeFirstPipe.transform(this.localStorageService.getItem('name'))
            });
    }

    protected fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    protected selectFile() {
        this.fileInput.nativeElement.click();
    }

    private createForm() {
        this.formGroup.valueChanges.subscribe(val => {
            this.artifactServices.updateForm(this.formGroup);
        });
    }

    protected getStyles() {
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

    private simulateUploadProgress(file: FileItem) {
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

    private saveFileToLocalStorage(file: FileItem) {
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

    removeFile(item: FileItem) {
        item.remove();
        this.localStorageService.removeItem('file');
    }
}
