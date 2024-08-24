import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {FileItem, FileUploader} from "ng2-file-upload";
import {ThemeService} from "../../../../services/theme/theme.service";
import {LocalStorageService} from "../../../../services/localstorage/local-storage.service";
import {ArtifactService} from "../../../../services/requirements/artifacts/artifact.service";
import {RequirementsDataModel} from "../../../../models/requirements-data-model";
import {ARTIFACT_TYPE_LIST} from "../../../../utils/artifact-type-list-util";
import {CapitalizeFirstPipePipe} from "../../../../pipes/capitalize-first-pipe.pipe";
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Status } from 'src/app/utils/util.status';
import { RichTextService } from 'src/app/services/richText/rich-text.service';
import { AlertService } from 'src/app/services/sweetalert/alert.service';

@Component({
    selector: 'app-create-artifact-form',
    templateUrl: './create-artifact-form.component.html',
    styleUrls: ['./create-artifact-form.component.scss']
})
export class CreateArtifactFormComponent implements OnInit {

    @ViewChild('fileInput') fileInput!: ElementRef;
    @Input() dataRequirementToTableRequirement: RequirementsDataModel | undefined;
    protected readonly ARTIFACT_TYPE_LIST = ARTIFACT_TYPE_LIST;
    formInvalid: boolean = true;

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
        private artifactService: ArtifactService,
        protected themeService: ThemeService,
        private localStorageService: LocalStorageService,
        private capitalizeFirstPipe: CapitalizeFirstPipePipe,
        private dialog: MatDialog,
        private alertService: AlertService,
        private richTextService: RichTextService,
        @Inject(MAT_DIALOG_DATA) public data: RequirementsDataModel) {

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
            this.formGroup.valueChanges.subscribe((f) => {
                    this.formInvalid = this.formGroup.invalid;
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
            this.artifactService.updateForm(this.formGroup);
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

    async saveData(): Promise<void> {

        console.log("this.prepareDataArtifact(this.requirementId): ", this.prepareDataArtifact(this.data.id))

        this.artifactService.createArtifact(this.prepareDataArtifact(this.data.id)).subscribe(respArt => {

            try {
                this.alertService.toSuccessAlert("Requisito Cadastrado com sucesso!");
                //this.localStorageService.clearAll();
                //this.dialog.closeAll();
                setTimeout(() => {
                    //window.location.reload();
                }, 3000);
            } catch (error) {
                throw new Error(`Exception caused ${error} and api response id ${respArt}`);
            }
        });

    }

    prepareDataArtifact(requirementId?: number) {

        const fileData = this.localStorageService.getItem('file');

        // console.log("fileData: ", fileData)
        //
        // console.log("fileData type: ", typeof fileData)

        let descriptionValue: string = '';

        this.richTextService.currentContent.subscribe(content => {
            descriptionValue = content;
        })

        //todo parei aqui, buscar a description

        if (this.formGroup && this.formGroup.valid) {

            console.log("this.artifactForm.value: ", this.formGroup.value)

            return {
                ...this.formGroup.value,
                name: this.formGroup.value.type.name,
                type: this.formGroup.value.type.identifier,
                file: fileData,
                requirementId: requirementId,
                description: descriptionValue
            };
        }
    }

    close() {
        this.dialog.closeAll();
    }
}
