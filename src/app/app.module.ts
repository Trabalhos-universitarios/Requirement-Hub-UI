import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {HeaderComponent} from "./shared/header/header.component";
import {SideBarComponent} from "./shared/side-bar/side-bar.component";
import {HomeComponent} from './core/home/home.component';
import {MatRippleModule} from "@angular/material/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgFor, NgIf, NgOptimizedImage} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {NoContentComponent} from './shared/no-content/no-content.component';
import {CreateProjectTabComponent} from './components/tabs/create-project-tab/create-project-tab.component';
import {
    ModalDialogCreateProjectComponent
} from './components/modals/projects/modal-dialog-create-project/modal-dialog-create-project';
import {MatDialogModule} from "@angular/material/dialog";
import {MatTabsModule} from "@angular/material/tabs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CreateProjectFormComponent} from "./components/forms/project/create-project-form/create-project-form.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {
    CreateProjectTableComponent
} from './components/tables/projects/create-project-table/create-project-table.component';
import {ProjectsTableComponent} from './components/tables/projects/projecs-table/projects-table.component';
import {MatMenuModule} from "@angular/material/menu";
import {DateFormatPipe} from './pipes/date-format.pipe';
import {
    ModalDialogCreateRequirementComponent
} from './components/modals/requirements/modal-dialog-create-requirement/modal-dialog-create-requirement.component';
import {CreateRequirementTabComponent} from './components/tabs/create-requirement-tab/create-requirement-tab.component';
import {
    CreateRequirementFormComponent
} from './components/forms/requirement/create-requirement-form/create-requirement-form.component';
import {
    CreateArtifactFormComponent
} from './components/forms/requirement/create-artifact-form/create-artifact-form.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {NgxFileDropModule} from "ngx-file-drop";
import {FileUploadModule} from "ng2-file-upload";
import {QuillModule} from 'ngx-quill';
import {RichTextEditorComponent} from "./components/richTextEditor/richTextEditor.component";
import {RichTextEditorModule} from "@syncfusion/ej2-angular-richtexteditor";
import {
    RequirementsTableComponent
} from './components/tables/requirements/requirements-table/requirements-table.component';
import {
    ModalDialogInformationProjectComponent
} from './components/modals/projects/modal-dialog-information-project/modal-dialog-information-project.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {AddArtifactsComponent} from './components/modals/artifacts/add-artifacts/add-artifacts.component';
import { DisplayColumnFormatPipePipe } from './pipes/display-column-format-pipe.pipe';
import { TracebilityMatrixComponent } from './components/modals/modeal-tracebility-matrix/tracebility-matrix.component';
import { ModalLoginComponent } from './auth/modals/modal-login/modal-login.component';
import { TokenInterceptor } from './auth/token-interceptor';
import { LoginComponent } from './auth/components/login/login.component';
import { ModalDialogUpdateProjectComponent } from './components/modals/projects/modal-dialog-update-project/modal-dialog-update-project.component';
import { UpdateProjectTabComponent } from './components/tabs/update-project-tab/update-project-tab.component';
import { UpdateProjectFormComponent } from './components/forms/project/update-project-form/update-project-form.component';
import { UpdateProjectTableComponent } from './components/tables/projects/update-project-table/update-project-table.component';
import { UpdateProjectUserTableComponent } from './components/tables/projects/update-project-user-table/update-project-user-table.component';
import { CapitalizeFirstPipePipe } from './pipes/capitalize-first-pipe.pipe';
import { ArtifactsProjectTableComponent } from './components/tables/projects/artifacts-project-table/artifacts-project-table.component';
import { ModalDialogArtifactsProjectComponent } from './components/modals/projects/modal-dialog-artifacts-project/modal-dialog-artifacts-project.component';
import { CreateArtifactProjectFormComponent } from './components/forms/project/create-artifact-project-form/create-artifact-project-form.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SideBarComponent,
        HomeComponent,
        NoContentComponent,
        CreateProjectTabComponent,
        ModalDialogCreateProjectComponent,
        CreateProjectFormComponent,
        CreateProjectTableComponent,
        ProjectsTableComponent,
        DateFormatPipe,
        ModalDialogCreateRequirementComponent,
        CreateRequirementTabComponent,
        CreateRequirementFormComponent,
        CreateArtifactFormComponent,
        RichTextEditorComponent,
        RequirementsTableComponent,
        ModalDialogInformationProjectComponent,
        AddArtifactsComponent,
        DisplayColumnFormatPipePipe,
        TracebilityMatrixComponent,
        LoginComponent,
        ModalLoginComponent,
        CapitalizeFirstPipePipe,
        ModalDialogUpdateProjectComponent,
        UpdateProjectTabComponent,
        UpdateProjectFormComponent,
        UpdateProjectTableComponent,
        ArtifactsProjectTableComponent,
        ModalDialogArtifactsProjectComponent,
        CreateArtifactProjectFormComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatTableModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatInputModule,
        MatSelectModule,
        MatRippleModule,
        MatTooltipModule,
        NgOptimizedImage,
        MatCardModule,
        MatDialogModule,
        MatTabsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NgIf,
        NgFor,
        HttpClientModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatProgressBarModule,
        MatButtonModule,
        NgxFileDropModule,
        FileUploadModule,
        QuillModule.forRoot(),
        RichTextEditorModule,
        MatPaginatorModule,
        MatTableModule,
        UpdateProjectUserTableComponent
    ],
    providers: [
        [CapitalizeFirstPipePipe],
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
      ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
