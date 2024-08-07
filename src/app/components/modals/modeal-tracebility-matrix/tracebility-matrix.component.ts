import { Component } from '@angular/core';
import { MatrixService } from 'src/app/services/matrix/traceability-matrix.service';
import { ProjectsTableService } from 'src/app/services/projects/projects-table.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

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
      private projectTableService: ProjectsTableService,
      private themeService: ThemeService)
      {this.getData();
      }

  getData() {
      this.traceabilityService.getTraceabilityMatrix().subscribe((matrix: []) => {
          this.dataSource = matrix;
          this.currentProject = this.projectTableService.getCurrentProject();
      });
  }

  getCellStyles(cell: any): any {
    let backgroundColor;
    let color;
    if (cell === "X") {
      backgroundColor = '#4CAF50'; color = 'black'      
    }
    else if (cell === '' || cell === '0') {
      if(this.themeService.isDarkMode()){backgroundColor = '#E4E4E4'}
      else {backgroundColor = '#3C3C3C'}
      
    }
    else if (cell !== null && cell !== '' && cell !== '0'){
      if(this.themeService.isDarkMode()){backgroundColor = '#E4E4E4'; color = 'black'}
      else {backgroundColor = '#3C3C3C'; color = 'white'} 
    }
    else{
      if(this.themeService.isDarkMode()){backgroundColor = '#3C3C3C'}
      else {backgroundColor = '#E4E4E4'}
    }
    return {
      'background-color': backgroundColor,
      'color': color
    };
  }
}
