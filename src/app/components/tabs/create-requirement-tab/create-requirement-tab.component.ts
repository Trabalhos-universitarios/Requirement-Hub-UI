import {Component, ViewChild} from '@angular/core';
import {CreateProjectFormComponent} from "../../forms/create-project-form/create-project-form.component";
import {CreateProjectTableComponent} from "../../tables/projects/create-project-table/create-project-table.component";

@Component({
  selector: 'app-create-requirement-tab',
  templateUrl: './create-requirement-tab.component.html',
  styleUrls: ['./create-requirement-tab.component.scss']
})
export class CreateRequirementTabComponent {
  @ViewChild(CreateProjectFormComponent) formComponent!: CreateProjectFormComponent;
  @ViewChild(CreateProjectTableComponent) tableComponent!: CreateProjectTableComponent;

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

      //TODO Parei aqui, tantando enviar os dados para o dataSource
      this.tableComponent.updateDataTable(formData);
    }
  }

}
