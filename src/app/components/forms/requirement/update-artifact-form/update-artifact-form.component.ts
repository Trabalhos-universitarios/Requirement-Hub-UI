import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RequirementsDataModel } from 'src/app/models/requirements-data-model';
import {ARTIFACT_TYPE_LIST} from "../../../../utils/artifact-type-list-util";
import {reloadPage} from "../../../../utils/reload.page";
import { FileItem, FileUploader } from 'ng2-file-upload';
import { ArtifactService } from 'src/app/services/requirements/artifacts/artifact.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';
import { CapitalizeFirstPipePipe } from 'src/app/pipes/capitalize-first-pipe.pipe';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/sweetalert/alert.service';
import { RichTextService } from 'src/app/services/richText/rich-text.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { ArtifactResponseModel } from 'src/app/models/artifact-response-model';

@Component({
  selector: 'app-update-artifact-form',
  templateUrl: './update-artifact-form.component.html',
  styleUrls: ['./update-artifact-form.component.scss']
})
export class UpdateArtifactFormComponent implements OnInit{

  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input() dataRequirementToTableRequirement: RequirementsDataModel | undefined;
  formInvalid: boolean = true;

  public formGroup: FormGroup = this.formBuilder.group({
      identifier: new FormControl({value: '', disabled: true}),
      name: new FormControl('', Validators.required),
      type: new FormControl({value: '', disabled: true}),
      description: new FormControl(''),
  });
  protected uploader: FileUploader = new FileUploader({url: '', itemAlias: 'file'});
  protected hasBaseDropZoneOver: boolean = false;
  hasFile: boolean = false;

  constructor(
      private formBuilder: FormBuilder,
      private artifactService: ArtifactService,
      protected themeService: ThemeService,
      private localStorageService: LocalStorageService,
      private capitalizeFirstPipe: CapitalizeFirstPipePipe,
      private dialog: MatDialog,
      private alertService: AlertService,
      private richTextService: RichTextService,
      private spinnerService: SpinnerService,
      @Inject(MAT_DIALOG_DATA) public data: ArtifactResponseModel) {

      this.getData(); 
      this.createForm();

      this.uploader.onAfterAddingFile = (file: FileItem) => {
        // Se já existir um arquivo na fila, remove-o antes de adicionar um novo
        if (this.uploader.queue.length > 1) {
            this.uploader.queue[0].remove();
        }
        file.withCredentials = false;
        this.simulateUploadProgress(file);
        }
  }
  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe((f) => {
      this.formInvalid = this.formGroup.invalid;
});
  }

  getData() {
    this.artifactService.getArtifactById(this.data.id).then((artifact: ArtifactResponseModel) => {
        
        this.formGroup.patchValue({
            identifier: artifact.identifier,
            name: artifact.name,
            type: artifact.type,
            description: artifact.description
        });

        this.richTextService.changeContent(artifact.description);

        if (artifact.file) {
          const fileItem = this.prepArtifact(artifact.file);
          if (fileItem) {
            this.uploader.addToQueue([fileItem._file]);
            this.simulateUploadProgress(fileItem); // Simula o progresso de upload
          } else {
            console.error("FileItem não pôde ser criado a partir do arquivo.");
          }
        }
        
           
    });
}

  protected fileOverBase(e: any): void {
      this.hasBaseDropZoneOver = e;
  }

  protected selectFile() {
    this.uploader.clearQueue();
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
              'border-color': '#9E9E9E',
               'color': '#EEEEEE'
          }
          : {
              'background-color': '#EEEEEE',
              'border-color': '#BDBDBD',
              'color': '#616161'
          };
  }

  private prepArtifact(fileString: string): FileItem {
    // Deserializar a string JSON
    let fileData;
    try {
      fileData = JSON.parse(fileString);
    } catch (error) {
      console.error("Erro ao analisar a string JSON:", error)
    }
  
    // Verifica se o conteúdo está no formato esperado
    if (!fileData.content || !fileData.name || !fileData.type) {
      console.error("Dados do arquivo estão incompletos ou mal formatados.");
    }
  
    // Extraindo a parte base64 do conteúdo
    const base64Data = fileData.content.split(',')[1]; // Ignorar o prefixo "data:application/pdf;base64,"
  
    // Decodifica a string base64
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    const sliceSize = 1024;
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    // Cria o Blob a partir do array de bytes
    const blob = new Blob(byteArrays, { type: fileData.type });
    const file = new File([blob], fileData.name, { type: fileData.type });
  
    // Inicializa o FileUploader com uma URL vazia
    const uploader: FileUploader = new FileUploader({ url: '' });
  
    // Cria um FileItem a partir do File
    return new FileItem(uploader, file, { url: '' });
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
      this.hasFile = false;
  }

  updateData(): void {
    this.artifactService.updateArtifact(this.data.id, this.prepareDataArtifact()).subscribe({
        next: (response) => {
            console.log(response);
            this.alertService.toSuccessAlert("Artefato atualizado com sucesso!").then(() => {
                this.localStorageService.removeItem('file');
                this.dialog.closeAll();
                this.spinnerService.start();
                reloadPage();
            });
        },
        error: (error) => {
            console.error('Erro ao atualizar o artefato:', error);
            if (error === 409) {
                this.alertService.toErrorAlert(
                    "Erro!",
                    "Já existe um artefato com esse nome e esse tipo vinculado a esse requisito!"
                );
            } else if (error === 404) {
                this.alertService.toErrorAlert("Erro!", "Rota não encontrada ou fora!");
            } else if (error === 500) {
                this.alertService.toErrorAlert("Erro!", "Erro interno do servidor!");
            } else {
                this.alertService.toErrorAlert("Erro!", "Erro ao atualizar o artefato - " + error);
            }
        }
    });
}



  prepareDataArtifact() {

      let fileData: any = {
          name: null,
          size: null,
          type: null,
          content: null
      };

      let local = this.localStorageService.getItem('file') 

      if(!(local && Object.keys(local).length === 0)){
          fileData = this.localStorageService.getItem('file');
      }
      else{
          fileData = JSON.stringify(fileData)
      }
    
      let descriptionValue: string = '';

      this.richTextService.currentContent.subscribe(content => {
          descriptionValue = content;
      })
          return {
              name: this.formGroup.value.name,
              file: fileData,
              description: descriptionValue,
          };
  }

  close() {
      this.dialog.closeAll();
  }
}

