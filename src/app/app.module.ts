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
import {HeaderComponent} from "./core/header/header.component";
import {SideBarComponent} from "./core/side-bar/side-bar.component";
import { HomeComponent } from './features/home/home.component';
import {MatRippleModule} from "@angular/material/core";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SideBarComponent,
        HomeComponent
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
        MatTooltipModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
