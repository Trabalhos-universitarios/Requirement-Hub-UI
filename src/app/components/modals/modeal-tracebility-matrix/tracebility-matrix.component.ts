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
  relationsIdentifierAndName: any = {
    RF1: "Cadastro de Projetos/ Engenharia",
    RF2: "Cadastro de Membros do Projeto/ Engenharia",
    RF3: "Login de Membros do Projeto/ Engenharia",
    RF4: "Controle de Acesso/ Engenharia",
    RF5: "Área Inicial dos Projetos/ Negócios",
    RF6: "Cadastro de Requisitos/ Negócios",
    RF7: "Classificação e Organização de Requisitos/ Negócios",
    RF8: "Cadastro de Artefatos, Módulos e Documentos/ Negócios",
    RF9: "Associação de Requisitos com Artefatos/ Negócios",
    RF10: "Visualização das Associações dos Requisitos/ Negócios",
    RF11: "Revisões dos Requisitos/ Negócios",
    RF12: "Associação de Requisitos a Usuários ou Equipes/ Negócios",
    RF13: "Especificação dos Requisito/ Negócioss",
    RF14: "Validação dos Requisitos/ Negócios",
    RF15: "Validação de Artefatos/ Negócios",
    RF16: "Versionamento dos Requisitos/ Negócios",
    RF17: "Registro de Mudanças nos Requisitos/ Negócios",
    RF18: "Geração de Visualizações de Status/ Negócios",
    RF19: "Criação de Matriz de Rastreabilidade de Requisitos/ Negócios",
    RF20: "Deleção de Projetos/ Negócios",
    RF21: "Deleção de Membros de Projetos/ Negócios",
    RF22: "Upload de Arquivos de Projeto/ Negócios",
    RF23: "Download de Arquivos de Projeto/ Negócios"
  };

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
      const value = this.relationsIdentifierAndName[cell];
      return value
    }
    return cell === "X" ? "Click" : cell;
  }

  toggleHighlight(rowIndex: number, colIndex: number): void {
    const cellValue = this.dataSource[rowIndex][colIndex];
  
    // Apenas células com "X" podem ser destacadas
    if (cellValue === "X") {
      if (this.highlightedRow === rowIndex && this.highlightedColumn === colIndex) {
        // Desmarcar se a célula já estiver destacada
        this.highlightedRow = null;
        this.highlightedColumn = null;
      } else {
        // Registrar nova célula como destacada
        this.highlightedRow = rowIndex;
        this.highlightedColumn = colIndex;
      }
    }
  
    console.log('Highlighted Row:', this.highlightedRow);
    console.log('Highlighted Column:', this.highlightedColumn);
  }
  
  isRelated(rowIndex: number, colIndex: number): boolean {
    // Verificar se temos uma célula selecionada
    if (this.highlightedRow === null || this.highlightedColumn === null) {
      return false;
    }
  
    // Verificar se a célula está à esquerda (mesma linha) ou acima (mesma coluna)
    return (rowIndex === this.highlightedRow && colIndex < this.highlightedColumn) || 
           (colIndex === this.highlightedColumn && rowIndex < this.highlightedRow);
  }  
  
  isHeader(rowIndex: number, colIndex: number): boolean {
    if (this.highlightedRow === null || this.highlightedColumn === null) {
      return false;
    }
  
    // Destaque apenas o cabeçalho da coluna e linha relacionados
    return (rowIndex === 0 && colIndex === this.highlightedColumn) || 
           (colIndex === 0 && rowIndex === this.highlightedRow);
  }
  
  isSpecificHighlight(rowIndex: number, colIndex: number): boolean {
    if (this.highlightedRow === null || this.highlightedColumn === null) {
      return false;
    }
  
    return (rowIndex === this.highlightedRow && colIndex === 0) ||
           (rowIndex === 0 && colIndex === this.highlightedColumn);
  }
}
