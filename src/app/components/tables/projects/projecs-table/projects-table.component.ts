import {Component} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {DataModel} from "../create-project-table/data-model";
import {ProjectsService} from "../../../../services/shared/projects/projects.service";
import {Status} from "./utils/status";
import {ThemeService} from "../../../../services/theme/theme.service";
import {ModalDialogCreateProjectComponent} from "../../../modals/modal-dialog-create-project/modal-dialog-create-project";
import {MatDialog} from "@angular/material/dialog";
import {
    ModalDialogCreateRequirementComponent
} from "../../../modals/modal-dialog-create-requirement/modal-dialog-create-requirement.component";

@Component({
    selector: 'app-projects-table',
    templateUrl: './projects-table.component.html',
    styleUrls: ['./projects-table.component.scss']
})
export class ProjectsTableComponent {

    displayedColumns: string[] =
        [
            'nameProject',
            'dateCreationProject',
            'nameProjectManager',
            'status',
            'actions'
        ];

    dataSource = new MatTableDataSource<DataModel>([]);

    constructor(
        private projectsService: ProjectsService,
        protected themeService: ThemeService,
        private dialog: MatDialog) {
        this.getData();
    }

    getData() {
        this.projectsService.getProjects().subscribe((projects: DataModel[]) => {
            this.dataSource.data = projects;
        });
    }

    stylesStatusIcon(status: string) {
        let colorIcon: string = '#616161';
        if (this.themeService.isDarkMode()) {
            colorIcon = '#e0e0e0';
        }

        switch (status) {
            case Status.ACTIVE:
                return { color: '#4CAF50' };
            case Status.DRAFT:
                return { color: colorIcon };
            default:
                return { color: '#f44336' };
        }
    }

    getStatusIcon(status: string) {
        switch (status) {
            case Status.ACTIVE:
                return { icon: 'verified', name: 'Ativo' };
            case Status.DRAFT:
                return { icon: 'pending_actions', name: 'Rascunho' };
            default:
                return { icon: 'help_outline', name: 'Desconhecido' };
        }
    }

    stylesIconColor(iconName: string) {

        let colorIcon: string = '#616161';
        if (this.themeService.isDarkMode()) {
            colorIcon = '#e0e0e0';
        }
        switch (iconName) {
            case "border_color":
                return { color: colorIcon };
            case "delete_forever":
                return { color: colorIcon };
            case "info":
                return { color: colorIcon };
            case "add_circle":
                return { color: colorIcon };
            default:
                return { color: '#f44336' };
        }
    }

    openDialog() {
        console.log("Create requirement")
        this.dialog.open(ModalDialogCreateRequirementComponent);

    }
}
