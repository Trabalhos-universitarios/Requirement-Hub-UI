import {Component} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {DataModel} from "../create-project-table/data-model";
import {ProjectsService} from "../../../services/shared/projects/projects.service";
import {Status} from "./status";

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

    constructor(private projectsService: ProjectsService) {
        this.getData();
    }

    getData() {
        this.projectsService.getProjects().subscribe((projects: DataModel[]) => {
            this.dataSource.data = projects
        });
    }

    stylesStatusIcon(status: string) {
        switch (status) {
            case Status.ACTIVE:
                return { color: '#4CAF50' };
            case Status.DRAFT:
                return { color: 'primary' };
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
        switch (iconName) {
            case "border_color":
                return { color: 'primary' };
            case "delete_forever":
                return { color: '#f44336' };
            case "info":
                return { color: 'primary' };
            default:
                return { color: '#f44336' };
        }
    }
}
