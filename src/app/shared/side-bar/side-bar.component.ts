import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {ThemeService} from "../../services/theme/theme.service";
import {MatDrawer} from "@angular/material/sidenav";
import {ProjectsService} from "../../services/projects/projects.service";
import {CreateProjectDataModel} from "../../models/create-project-data-model";
import {SidebarService} from "../../services/sidebar/sidebar.service";
import {MatDialog} from "@angular/material/dialog";
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import {
    ModalDialogCreateProjectComponent
} from "../../components/modals/projects/modal-dialog-create-project/modal-dialog-create-project";
import { ProjectDataModel } from 'src/app/models/project-data-model';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';

@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

    dataSource = new MatTableDataSource<ProjectDataModel>([]);


    @ViewChild('drawer') drawer!: MatDrawer;
    hasProjects: boolean = false;

    constructor(
        private localstorage:LocalStorageService,
        private router: Router,
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
            .subscribe((projects: ProjectDataModel[]) => {
            this.hasProjects = projects && projects.length > 0;
            this.dataSource.data = projects;
        });
    }

    openModalDialogComponent() {
        this.dialog.open(ModalDialogCreateProjectComponent);
    }

    logout(){
        this.localstorage.clearAll()
        this.router.navigate(['/login']);
    }
}
