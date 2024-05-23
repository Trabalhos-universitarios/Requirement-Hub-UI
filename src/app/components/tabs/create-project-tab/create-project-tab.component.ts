import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {CreateProjectFormComponent} from "../../forms/create-project-form/create-project-form.component";
import {CreateProjectTableComponent} from "../../tables/create-project-table/create-project-table.component";

@Component({
  selector: 'app-create-project-tab',
  templateUrl: './create-project-tab.component.html',
  styleUrls: ['./create-project-tab.component.scss']
})
export class CreateProjectTabComponent implements AfterViewInit{
  @ViewChild(CreateProjectFormComponent) formComponent!: CreateProjectFormComponent;
  @ViewChild(CreateProjectTableComponent) tableComponent!: CreateProjectTableComponent;

  indexTab: number = 0;

  constructor() {}

  ngAfterViewInit() {
    // Garantir que os componentes filhos estão inicializados
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
