import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {ReactiveFormServices} from "../../../../services/forms/reactive-form-services.service";
import {CreateProjectDataModel} from "../../../../models/create-project-data-model";
import {CreateProjectFormComponent} from "../../../forms/project/create-project-form/create-project-form.component";
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
            data.requirementAnalysts.length,
            data.businessAnalysts.length,
            data.commonUsers.length,
        );

        for (let i = 0; i < maxLength; i++) {
            transformedData.push({
                name: data.name,
                version: data.version || '-',
                manager: data.manager || '-',
                requirementAnalysts: data.requirementAnalysts[i] || '-',
                businessAnalysts: data.businessAnalysts[i] || '-',
                commonUsers: data.commonUsers[i] || '-'
            });
        }
        return transformedData;
    }
}
