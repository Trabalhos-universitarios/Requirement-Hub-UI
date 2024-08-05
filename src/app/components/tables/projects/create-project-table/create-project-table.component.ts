import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {ReactiveFormServices} from "../../../../services/forms/reactive-form-services.service";
import {CreateProjectDataModel} from "../../../../models/create-project-data-model";
import {CreateProjectFormComponent} from "../../../forms/create-project-form/create-project-form.component";
import {CreateProjectTableRowModel} from "../../../../models/create-project-table-row-model";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-create-project-table',
    templateUrl: './create-project-table.component.html',
    styleUrls: ['./create-project-table.component.scss']
})
export class CreateProjectTableComponent implements AfterViewInit{

    @ViewChild(CreateProjectFormComponent) formComponent!: CreateProjectFormComponent;

    @Input() data: any;

    constructor(private createProjectService: ReactiveFormServices) {}
    displayedColumns: string[] =
        [
            'nameProject',
            'version',
            'nameProjectManager',
            'nameRequirementAnalyst',
            'nameBusinessAnalyst',
            'nameCommonUser'
        ];
    dataSource = new MatTableDataSource<CreateProjectTableRowModel>([]);

    ngAfterViewInit(): void {
        this.toDataSource();
    }

    toDataSource() {
        this.createProjectService.currentForm.subscribe();
    }

    updateDataTable(data: CreateProjectDataModel) {
        this.dataSource.data = this.formatDataToTable(data);
    }

    formatDataToTable(data: CreateProjectDataModel): CreateProjectTableRowModel[] {
        const transformedData: CreateProjectTableRowModel[] = [];

        const maxLength = Math.max(
            data.nameRequirementAnalyst.length,
            data.nameBusinessAnalyst.length,
            data.nameCommonUser.length,
        );

        for (let i = 0; i < maxLength; i++) {
            transformedData.push({
                nameProject: data.nameProject,
                version: data.version || '-',
                nameProjectManager: data.nameProjectManager || '-',
                nameRequirementAnalyst: data.nameRequirementAnalyst[i] || '-',
                nameBusinessAnalyst: data.nameBusinessAnalyst[i] || '-',
                nameCommonUser: data.nameCommonUser[i] || '-'
            });
        }
        return transformedData;
    }
}
