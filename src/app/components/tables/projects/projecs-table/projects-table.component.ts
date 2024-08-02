import {Component} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ProjectsService} from "../../../../services/projects/projects.service";
import {ThemeService} from "../../../../services/theme/theme.service";
import {MatDialog} from "@angular/material/dialog";
import {DataModel} from "./model/data-model";
import {Status} from "../../../../utils/util.status";
import {
    ModalDialogCreateRequirementComponent
} from "../../../modals/requirements/modal-dialog-create-requirement/modal-dialog-create-requirement.component";
import { TracebilityMatrixComponent } from '../../../modals/modeal-tracebility-matrix/tracebility-matrix.component';
import { ProjectsTableService } from 'src/app/services/projects/projects-table.service';
import {
    ModalDialogInformationProjectComponent
} from "../../../modals/projects/modal-dialog-information-project/modal-dialog-information-project.component";

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
            'version',
            'actions'
        ];

    dataSource = new MatTableDataSource<DataModel>([]);

    constructor(
        private projectsService: ProjectsService,
        private projectsTableService: ProjectsTableService,
        protected themeService: ThemeService,
        private dialog: MatDialog) {
        this.getData();
    }

    getData() {
        this.projectsService.getProjects().subscribe((projects: DataModel[]) => {
            this.dataSource.data = projects;
            console.log(this.dataSource.data)
        });
    }

    setDataProjectTable(currentProject : string) {
        this.projectsTableService.setCurrentProject(currentProject);
        console.log(currentProject)
        }

    stylesStatusIcon(status: string) {
        let colorIcon: string = '#616161';
        if (this.themeService.isDarkMode()) {
            colorIcon = '#e0e0e0';
        }

        switch (status) {
            case Status.ACTIVE:
                return {color: '#4CAF50'};
            case Status.DRAFT:
                return {color: colorIcon};
            default:
                return {color: '#f44336'};
        }
    }

    getStatusIcon(status: string) {
        switch (status) {
            case Status.ACTIVE:
                return {icon: 'verified', name: 'Ativo'};
            case Status.DRAFT:
                return {icon: 'pending_actions', name: 'Rascunho'};
            default:
                return {icon: 'help_outline', name: 'Desconhecido'};
        }
    }

    stylesIconColor(iconName: string) {

        let colorIcon: string = '#616161';
        if (this.themeService.isDarkMode()) {
            colorIcon = '#e0e0e0';
        }
        switch (iconName) {
            case "border_color":
                return {color: colorIcon};
            case "delete_forever":
                return {color: colorIcon};
            case "info":
                return {color: colorIcon};
            case "add_circle":
                return {color: colorIcon};
            default:
                return {color: '#f44336'};
        }
    }

    openDialog(action?: string) {
        switch (action) {
            case 'Criar requisitos':
                this.dialog.open(ModalDialogCreateRequirementComponent);
                break;
            case 'Informações':
                this.dialog.open(ModalDialogInformationProjectComponent);
                break;
            case 'Matriz de Rastreabilidade':
                this.dialog.open(TracebilityMatrixComponent);
                break
            default:
                console.error("This dialog non exists!")
        }

    }
}
