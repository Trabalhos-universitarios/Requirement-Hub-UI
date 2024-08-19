import {Component, Input} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ThemeService} from "../../../../services/theme/theme.service";
import {MatDialog} from "@angular/material/dialog";
import {ProjectDataModel} from "../../../../models/project-data-model";
import {Status} from "../../../../utils/util.status";
import {
    ModalDialogCreateRequirementComponent
} from "../../../modals/requirements/modal-dialog-create-requirement/modal-dialog-create-requirement.component";
import {TracebilityMatrixComponent} from '../../../modals/modeal-tracebility-matrix/tracebility-matrix.component';
import {ProjectsTableService} from 'src/app/services/projects/projects-table.service';
import {
    ModalDialogInformationProjectComponent
} from "../../../modals/projects/modal-dialog-information-project/modal-dialog-information-project.component";
import {LocalStorageService} from 'src/app/services/localstorage/local-storage.service';
import {
    ModalDialogUpdateProjectComponent
} from 'src/app/components/modals/projects/modal-dialog-update-project/modal-dialog-update-project.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {
    ModalDialogArtifactsProjectComponent
} from 'src/app/components/modals/projects/modal-dialog-artifacts-project/modal-dialog-artifacts-project.component';
import {AlertService} from "../../../../services/sweetalert/alert.service";
import {ProjectsService} from "../../../../services/projects/projects.service";
import {reloadPage} from "../../../../utils/reload.page";
import {SpinnerService} from "../../../../services/spinner/spinner.service";

@Component({
    selector: 'app-projects-table',
    templateUrl: './projects-table.component.html',
    styleUrls: ['./projects-table.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class ProjectsTableComponent {

    @Input()
    dataSource = new MatTableDataSource<ProjectDataModel>([]);
    displayedColumns: string[] =
        [
            'nameProject',
            'dateCreationProject',
            'nameProjectManager',
            'status',
            'version',
        ];

    columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
    expandedElement: ProjectDataModel | undefined;

    constructor(
        private projectsTableService: ProjectsTableService,
        protected themeService: ThemeService,
        private localStorage: LocalStorageService,
        private sanitizer: DomSanitizer,
        private dialog: MatDialog,
        private alertService: AlertService,
        private projectsService: ProjectsService,
        private spinnerService: SpinnerService) {
    }

    sanitizeHtml(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    setDataProjectTable(id: number, currentProject: string) {
        this.projectsTableService.setCurrentProjectById(id);
        this.projectsTableService.setCurrentProjectByName(currentProject);
    }

    isPermitted() {
        return !(this.localStorage.getItem('role') == "GERENTE_DE_PROJETOS" ||
            this.localStorage.getItem('role') == "ANALISTA_DE_REQUISITOS" ||
            this.localStorage.getItem('role') == "ANALISTA_DE_NEGOCIO");
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
                this.dialog.open(ModalDialogUpdateProjectComponent);
                break;
            case 'Delete project':
                this.deleteProject().then()
                break;
            case 'Create requirement':
                this.dialog.open(ModalDialogCreateRequirementComponent);
                break;
            case 'Requirement list':
                console.log("ABRIU AQUI PROJECT TABLE")
                this.dialog.open(ModalDialogInformationProjectComponent);
                break;
            case 'Traceability matrix':
                this.dialog.open(TracebilityMatrixComponent);
                break
            case 'Artifacts project':
                this.dialog.open(ModalDialogArtifactsProjectComponent);
                break
            default:
                console.error("This dialog non exists!")
        }
    }

    private async deleteProject() {
        const result = await this.alertService.toOptionalActionAlert(
            "Deletar projeto",
            "Deseja realmente excluir o projeto?"
        );

        console.log("result", result);

        console.log("this.projectsTableService.getCurrentProjectById()", this.projectsTableService.getCurrentProjectById());

        if (result.isConfirmed) {
            await this.projectsService.deleteProject(this.projectsTableService.getCurrentProjectById());
            reloadPage();
        }
    }
}
