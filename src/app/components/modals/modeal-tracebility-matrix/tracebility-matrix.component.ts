import { Component } from '@angular/core';
import { MatrixService } from 'src/app/services/matrix/traceability-matrix.service';
import { ProjectsTableService } from 'src/app/services/projects/projects-table.service';

@Component({
  selector: 'app-tracebility-matrix',
  templateUrl: './tracebility-matrix.component.html',
  styleUrls: ['./tracebility-matrix.component.scss']
})
export class TracebilityMatrixComponent {

  dataSource = [];
  currentProject: string = ''

  constructor(
      private traceabilityService: MatrixService,
      private projectTableService: ProjectsTableService)
      {this.getData();
      }

  getData() {
      this.traceabilityService.getTraceabilityMatrix().subscribe((matrix: []) => {
          this.dataSource = matrix;
          this.currentProject = this.projectTableService.getCurrentProject();
          console.log(this.currentProject)
      });
  }

  getCellStyles(cell: any): any {
    let backgroundColor;
    if (cell === null) {
      backgroundColor = 'black';
    } else if (cell === "") {
      backgroundColor = 'white';
    } 
    else if (cell === "X") {
      backgroundColor = 'lightgreen';
    }
      else {
      backgroundColor = 'gray';
    }
    return {
      'background-color': backgroundColor
    };
  }
}
