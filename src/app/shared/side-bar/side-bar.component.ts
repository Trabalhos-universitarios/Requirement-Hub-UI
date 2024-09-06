import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
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
import { ModalDialogCreateUserComponent } from 'src/app/components/modals/user/modal-dialog-create-user/modal-dialog-create-user.component';
import { ModalDialogDeleteUserComponent } from 'src/app/components/modals/user/modal-dialog-delete-user/modal-dialog-delete-user.component';

@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements AfterViewInit {

    @ViewChild('drawer') drawer!: MatDrawer;
    dataSource = new MatTableDataSource<ProjectDataModel>([]);

    constructor(
        private localStorage: LocalStorageService,
        private router: Router,
        private themeService: ThemeService,
        private projectsService: ProjectsService,
        private sidebarService: SidebarService,
        private dialog: MatDialog,
        private localStorageService: LocalStorageService) {
        this.themeService.initTheme();
        this.getData().then();
    }

    ngAfterViewInit() {
        this.sidebarService.setDrawer(this.drawer);
    }

    async getData() {
        await this.projectsService.getProjectsByUserId(this.localStorageService.getItem('id'))
            .then((projects: ProjectDataModel[]) => {
                projects.sort((a, b) => a.name.localeCompare(b.name));
                this.dataSource.data = projects
            })
            .catch(error => {
                console.error(`Error : ${error} -> ${error.message}`)
            })
    }

    openModalDialogComponent(action: string) {
        switch (action) {
            case 'Create project':
                this.dialog.open(ModalDialogCreateProjectComponent,{
                    disableClose: true
                });
                break;
            case 'Add user':
                this.dialog.open(ModalDialogCreateUserComponent,{
                    disableClose: false
                });
                break;
                case 'delete user':
                    this.dialog.open(ModalDialogDeleteUserComponent,{
                        disableClose: true
                    });
                    break;
            default:
                console.error("This dialog non exists!")
        }
    }

    isManager() {
        return this.localStorage.getItem('role') != "GERENTE_DE_PROJETOS";

    }

    isAdmin() {
        return this.localStorage.getItem('role') != "ADMIN";

    }

    async logout() {
        this.localStorage.clearAll()
        await this.router.navigate(['/login']);
    }
}
