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
import {NoContentComponent} from './components/no-content/no-content.component';
import {CreateProjectTabComponent} from './components/tabs/create-project-tab/create-project-tab.component';
import {ModalDialogCreateProjectComponent} from './components/modals/modal-dialog-create-project/modal-dialog-create-project';
import {MatDialogModule} from "@angular/material/dialog";
import {MatTabsModule} from "@angular/material/tabs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CreateProjectFormComponent} from "./components/forms/create-project-form/create-project-form.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {HttpClientModule} from "@angular/common/http";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { CreateProjectTableComponent } from './components/tables/projects/create-project-table/create-project-table.component';
import { ProjectsTableComponent } from './components/tables/projects/projecs-table/projects-table.component';
import {MatMenuModule} from "@angular/material/menu";
import { DateFormatPipe } from './pipes/date-format.pipe';
import { ModalDialogCreateRequirementComponent } from './components/modals/modal-dialog-create-requirement/modal-dialog-create-requirement.component';
import { CreateRequirementTabComponent } from './components/tabs/create-requirement-tab/create-requirement-tab.component';
import { CreateRequirementFormComponent } from './components/forms/requirement/create-requirement-form/create-requirement-form.component';
import { RegisterArtifactComponent } from './components/forms/requirement/register-artifact/register-artifact.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {NgxFileDropModule} from "ngx-file-drop";
import {FileUploadModule} from "ng2-file-upload";

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
        RegisterArtifactComponent,
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
        FileUploadModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
