import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CreateProjectFormService} from "../../../../services/components/forms/create-project-form.service";
import {FileUploader} from "ng2-file-upload";
import {ThemeService} from "../../../../services/theme/theme.service";

const URL = 'http://localhost:8180/artifacts'; // URL para o servidor de upload

@Component({
  selector: 'app-register-artifact',
  templateUrl: './register-artifact.component.html',
  styleUrls: ['./register-artifact.component.scss']
})
export class RegisterArtifactComponent {
  public formGroup: FormGroup = this.formBuilder.group({
    identifierArtifact: new FormControl('', Validators.required),
    authorArtifact: new FormControl('', Validators.required),
    typeArtifact: new FormControl('', Validators.required),
    artifactDescription: new FormControl('', Validators.required),
  });

  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'file' });
  public hasBaseDropZoneOver: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private formBuilder: FormBuilder, private createProjectService: CreateProjectFormService, protected themeService: ThemeService) {
    this.createForm();
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item, response, status, headers) => {
      console.log('FileUpload:uploaded:', item, status, response);
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public selectFile() {
    this.fileInput.nativeElement.click();
  }

  public uploadAllFiles() {
    this.uploader.uploadAll();
  }

  createForm() {
    this.formGroup.valueChanges.subscribe(val => {
      this.createProjectService.updateForm(this.formGroup);
    });
  }

  getStyles() {

    let styles =
        {
          'background-color': '',
          'border-color': ''
        }

      if (this.themeService.isDarkMode()) {
        styles["background-color"] = '#616161';
        styles["border-color"] = '#9E9E9E';
      } else {
        styles["background-color"] = '#EEEEEE';
        styles["border-color"] = '#BDBDBD';
      }


    return styles;
  }

  // updateThemeColors() {
  //
  //   if (this.themeService.isDarkMode()) {
  //     this.backgroundColor = '#757575';
  //     this.borderColor = '#E0E0E0';
  //   } else {
  //     this.backgroundColor = '#E0E0E0';
  //     this.borderColor = '#BDBDBD';
  //   }
  // }

  getFormData(indexTab: number | undefined) {
    return this.formGroup.value;
  }

  toppingList: string[] = ['Johnny Carvalho', 'Lucas Lemes', 'Elias Coutinho', 'Bruna Carvalho', 'Rebeca Carvalho', 'João Victor'];
}
