import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {CreateProjectFormService} from "../../../../services/components/forms/create-project-form.service";
import {DataModel} from "./data-model";
import {CreateProjectFormComponent} from "../../../forms/create-project-form/create-project-form.component";
import {TableRowModel} from "./TableRowModel";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-create-project-table',
    templateUrl: './create-project-table.component.html',
    styleUrls: ['./create-project-table.component.scss']
})
export class CreateProjectTableComponent implements AfterViewInit{

    @ViewChild(CreateProjectFormComponent) formComponent!: CreateProjectFormComponent;

    @Input() data: any;

    constructor(private createProjectService: CreateProjectFormService) {}
    displayedColumns: string[] =
        [
            'nameProject',
            'nameProjectManager',
            'nameRequirementAnalyst',
            'nameBusinessAnalyst',
            'nameCommonUser'
        ];
    dataSource = new MatTableDataSource<TableRowModel>([]);

    ngAfterViewInit(): void {
        this.toDataSource();
    }

    toDataSource() {
        this.createProjectService.currentForm.subscribe();
    }

    updateDataTable(data: DataModel) {
        this.dataSource.data = this.formatDataToTable(data);

    }

    formatDataToTable(data: DataModel): TableRowModel[] {
        const transformedData: TableRowModel[] = [];

        const maxLength = Math.max(
            data.nameProjectManager.length,
            data.nameRequirementAnalyst.length,
            data.nameBusinessAnalyst.length,
            data.nameCommonUser.length
        );

        for (let i = 0; i < maxLength; i++) {
            transformedData.push({
                nameProject: data.nameProject,
                nameProjectManager: data.nameProjectManager[i] || '-',
                nameRequirementAnalyst: data.nameRequirementAnalyst[i] || '-',
                nameBusinessAnalyst: data.nameBusinessAnalyst[i] || '-',
                nameCommonUser: data.nameCommonUser[i] || '-'
            });
        }
        return transformedData;
    }
}
