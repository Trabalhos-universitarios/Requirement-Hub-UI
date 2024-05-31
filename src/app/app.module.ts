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
import {ModalDialogComponent} from './components/modal-dialog/modal-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatTabsModule} from "@angular/material/tabs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CreateProjectFormComponent} from "./components/forms/create-project-form/create-project-form.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {HttpClientModule} from "@angular/common/http";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { CreateProjectTableComponent } from './components/tables/create-project-table/create-project-table.component';
import { ProjectsTableComponent } from './components/tables/projecs-table/projects-table.component';
import {MatMenuModule} from "@angular/material/menu";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SideBarComponent,
        HomeComponent,
        NoContentComponent,
        CreateProjectTabComponent,
        ModalDialogComponent,
        CreateProjectFormComponent,
        CreateProjectTableComponent,
        ProjectsTableComponent,
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
        MatMenuModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
