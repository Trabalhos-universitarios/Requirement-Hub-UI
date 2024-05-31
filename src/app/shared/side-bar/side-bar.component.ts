import {Component, ViewChild} from '@angular/core';
import {ThemeService} from "../../services/theme/theme.service";
import {MatDrawer} from "@angular/material/sidenav";
import {ProjectsService} from "../../services/shared/projects/projects.service";
import {DataModel} from "../../components/tables/create-project-table/data-model";
import {SidebarService} from "../../services/shared/sidebar/sidebar.service";
import {MatDialog} from "@angular/material/dialog";
import {ModalDialogComponent} from "../../components/modal-dialog/modal-dialog.component";

@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

    @ViewChild('drawer') drawer!: MatDrawer;
    hasProjects: boolean = false;

    constructor(
        private themeService: ThemeService,
        private projectsService: ProjectsService,
        private sidebarService: SidebarService,
        private dialog: MatDialog) {
        this.themeService.initTheme();

        this.getData();
    }

    ngAfterViewInit() {
        this.sidebarService.setDrawer(this.drawer);
    }

    getData() {
        this.projectsService.getProjects()
            .subscribe((projects: DataModel[]) => {
            this.hasProjects = projects && projects.length > 0;
        });
    }

    openModalDialogComponent() {
        this.dialog.open(ModalDialogComponent);
    }
}
