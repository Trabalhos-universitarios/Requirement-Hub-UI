import {Component} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ProjectsService} from "../../../../services/projects/projects.service";
import {ThemeService} from "../../../../services/theme/theme.service";
import {MatDialog} from "@angular/material/dialog";
import {ProjectDataModel} from "../../../../models/project-data-model";
import {Status} from "../../../../utils/util.status";
import {
    ModalDialogCreateRequirementComponent
} from "../../../modals/requirements/modal-dialog-create-requirement/modal-dialog-create-requirement.component";
import { TracebilityMatrixComponent } from '../../../modals/modeal-tracebility-matrix/tracebility-matrix.component';
import { ProjectsTableService } from 'src/app/services/projects/projects-table.service';
import {
    ModalDialogInformationProjectComponent
} from "../../../modals/projects/modal-dialog-information-project/modal-dialog-information-project.component";
import { ModalDialogDeleteProjectComponent } from 'src/app/components/modals/projects/modal-dialog-delete-project/modal-dialog-delete-project.component';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';

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

    dataSource = new MatTableDataSource<ProjectDataModel>([]);

    constructor(
        private projectsService: ProjectsService,
        private projectsTableService: ProjectsTableService,
        protected themeService: ThemeService,
        private localStorage : LocalStorageService,
        private dialog: MatDialog) {
        this.getData();
    }

    getData() {
        this.projectsService.getProjects().subscribe((projects: ProjectDataModel[]) => {
            this.dataSource.data = projects;
        });
    }

    setDataProjectTable(id : number, currentProject : string) {
        this.projectsTableService.setCurrentIdProject(id);
        this.projectsTableService.setCurrentProject(currentProject);
        }

    userPermited(){
        if(this.localStorage.getItem('role') == "GERENTE_DE_PROJETOS"){
            return false;
        }
        return true;
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
            case 'Put project':
                this.dialog.open(ModalDialogCreateRequirementComponent);
                break;
            case 'Delete project':
                this.dialog.open(ModalDialogDeleteProjectComponent, {
                    width: '400px',
                    data: { message: 'Tem certeza que deseja deletar o projeto?' }});
                break;
            case 'Create requirement':
                this.dialog.open(ModalDialogCreateRequirementComponent);
                break;
            case 'Requirement list':
                this.dialog.open(ModalDialogInformationProjectComponent);
                break;
            case 'Traceability matrix':
                this.dialog.open(TracebilityMatrixComponent);
                break
            default:
                console.error("This dialog non exists!")
        }

    }
}
