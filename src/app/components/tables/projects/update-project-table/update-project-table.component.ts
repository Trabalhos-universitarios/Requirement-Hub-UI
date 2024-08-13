import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UpdateProjectFormComponent } from 'src/app/components/forms/update-project-form/update-project-form.component';
import { CreateProjectDataModel } from 'src/app/models/create-project-data-model';
import { CreateProjectTableRowModel } from 'src/app/models/create-project-table-row-model';
import { ProjectDataModel } from 'src/app/models/project-data-model';
import { ReactiveFormServices } from 'src/app/services/forms/reactive-form-services.service';

@Component({
  selector: 'app-update-project-table',
  templateUrl: './update-project-table.component.html',
  styleUrls: ['./update-project-table.component.scss']
})
export class UpdateProjectTableComponent implements AfterViewInit{

  @ViewChild(UpdateProjectFormComponent) formComponent!: UpdateProjectFormComponent;

    @Input() data: any;

    constructor(private updateProjectService: ReactiveFormServices) {}
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
        this.updateProjectService.currentForm.subscribe();
    }

    updateDataTable(data: CreateProjectTableRowModel) {
        this.dataSource.data = this.formatDataToTable(data);
    }

    formatDataToTable(data: CreateProjectTableRowModel): CreateProjectTableRowModel[] {
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
