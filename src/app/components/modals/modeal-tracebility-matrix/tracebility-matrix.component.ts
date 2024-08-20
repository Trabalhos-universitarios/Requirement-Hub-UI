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
  currentProject: string = '';
  highlightedRow: number | null = null;
  highlightedColumn: number | null = null;

  constructor(
      private traceabilityService: MatrixService,
      private projectTableService: ProjectsTableService,
      private themeService: ThemeService)
      {
        this.getData();
      }

  getData() {
      this.traceabilityService.getTraceabilityMatrix(this.projectTableService.getCurrentProjectById()).subscribe((matrix: []) => {
          this.dataSource = matrix;
          this.currentProject = this.projectTableService.getCurrentProjectByName();
      });
  }

  getCellStyles(cell: any): any {
    let backgroundColor;
    let color;
    if (cell === "X") {
      backgroundColor = '#4CAF50'; 
      color = 'black';
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

  getTooltipText(cell: any, rowIndex: number, colIndex: number): string {
    if (rowIndex === 0 || colIndex === 0) {
      return cell;
    }
    return cell === "X" ? "Click" : cell;
  }

  toggleHighlight(rowIndex: number, colIndex: number): void {
    const cellValue = this.dataSource[rowIndex][colIndex];
    
    if (cellValue === "X") {
      if (this.highlightedRow === rowIndex && this.highlightedColumn === colIndex) {
        // Se a célula já está destacada, desmarcar
        this.highlightedRow = null;
        this.highlightedColumn = null;
      } else {
        // Se a célula não está destacada, destacar
        this.highlightedRow = rowIndex;
        this.highlightedColumn = colIndex;
      }
    }
  }
  
  isRelated(rowIndex: number, colIndex: number): boolean {
    // Destacar apenas as células à esquerda e acima
    if (this.highlightedRow === null || this.highlightedColumn === null) {
      return false;
    }
    return (rowIndex === this.highlightedRow && colIndex <= this.highlightedColumn) || 
           (colIndex === this.highlightedColumn && rowIndex <= this.highlightedRow);
  }
  
  isHeader(rowIndex: number, colIndex: number): boolean {
    // Aqui se mantém a lógica de destacar os cabeçalhos, se necessário
    return rowIndex === this.highlightedRow || colIndex === this.highlightedColumn;
  }
  
  isSpecificHighlight(rowIndex: number, colIndex: number): boolean {
    if (this.highlightedRow === null || this.highlightedColumn === null) {
      return false;
    }
  
    return (rowIndex === this.highlightedRow && colIndex === 0) ||
           (rowIndex === 0 && colIndex === this.highlightedColumn);
  }
}
