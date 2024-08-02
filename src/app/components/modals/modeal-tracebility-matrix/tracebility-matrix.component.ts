import { Component } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatrixService } from 'src/app/services/matrix/matrix.service';

@Component({
  selector: 'app-tracebility-matrix',
  templateUrl: './tracebility-matrix.component.html',
  styleUrls: ['./tracebility-matrix.component.scss']
})
export class TracebilityMatrixComponent {

  dataSource = [];

  constructor(
      private traceabilityService: MatrixService){this.getData();}

  getData() {
      this.traceabilityService.getTraceabilityMatrix().subscribe((matrix: []) => {
          this.dataSource = matrix;
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
