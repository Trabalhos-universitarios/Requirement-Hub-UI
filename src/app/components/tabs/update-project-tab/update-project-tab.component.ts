import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { UpdateProjectFormComponent } from '../../forms/project/update-project-form/update-project-form.component';
import { UpdateProjectTableComponent } from '../../tables/projects/update-project-table/update-project-table.component';

@Component({
  selector: 'app-update-project-tab',
  templateUrl: './update-project-tab.component.html',
  styleUrls: ['./update-project-tab.component.scss']
})
export class UpdateProjectTabComponent implements AfterViewInit{

  @ViewChild(UpdateProjectFormComponent) formComponent!: UpdateProjectFormComponent;
  @ViewChild(UpdateProjectTableComponent) tableComponent!: UpdateProjectTableComponent;

  indexTab: number = 0;

  constructor() {}

  ngAfterViewInit() {
    this.updateTableData();
  }

  onTabChange(event: any) {
    this.indexTab = event
    if (event === 1) {
      this.updateTableData(event);
    }
  }

  updateTableData(indexTab?: number) {
    if (this.formComponent && this.tableComponent) {
      const formData = this.formComponent.getFormData(indexTab);

      this.tableComponent.updateDataTable(formData);
    }
  }

}
