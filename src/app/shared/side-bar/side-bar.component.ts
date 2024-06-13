import {Component, ViewChild} from '@angular/core';
import {ThemeService} from "../../services/theme/theme.service";
import {MatDrawer} from "@angular/material/sidenav";
import {ProjectsService} from "../../services/projects/projects.service";
import {DataModel} from "../../components/tables/projects/create-project-table/data-model";
import {SidebarService} from "../../services/sidebar/sidebar.service";
import {MatDialog} from "@angular/material/dialog";
import {ModalDialogCreateProjectComponent} from "../../components/modals/modal-dialog-create-project/modal-dialog-create-project";

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
        this.dialog.open(ModalDialogCreateProjectComponent);
    }
}
