import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatrixService } from 'src/app/services/matrix/traceability-matrix.service';
import { ProjectsTableService } from 'src/app/services/projects/projects-table.service';
import { RequirementsService } from 'src/app/services/requirements/requirements.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { ModalDialogInformationRequirementComponent } from '../requirements/modal-dialog-information-requirement/modal-dialog-information-requirement.component';
import { ModalDialogInformationRequirementArtifactComponent } from '../requirements/modal-dialog-information-requirement-artifact/modal-dialog-information-requirement-artifact.component';
import { ArtifactService } from 'src/app/services/requirements/artifacts/artifact.service';
import { RequirementsDataModel } from 'src/app/models/requirements-data-model';
import { ArtifactResponseModel } from 'src/app/models/artifact-response-model';
import { UsersService } from 'src/app/services/users/users.service';
import { UserResponseModel } from 'src/app/models/user-model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tracebility-matrix',
  templateUrl: './tracebility-matrix.component.html',
  styleUrls: ['./tracebility-matrix.component.scss']
})
export class TracebilityMatrixComponent implements AfterViewInit {

  dataSource = [];
  currentProject: string = '';
  highlightedRow: number | null = null;
  highlightedColumn: number | null = null;
  relationsIdentifierAndName: any = {};
  userName: any = {};
  requirementsData: RequirementsDataModel[] = [];
  artifactsData: ArtifactResponseModel[] = [];
  usersData: UserResponseModel[] = [];

  constructor(
    private traceabilityService: MatrixService,
    private projectTableService: ProjectsTableService,
    private themeService: ThemeService,
    private spinnerService: SpinnerService,
    private requirementsService: RequirementsService,
    private artifactService: ArtifactService,
    private userService: UsersService,
    private dialog: MatDialog
  ) { }

  ngAfterViewInit() {
    this.getAllDataAndMatrix();
  }

  getAllDataAndMatrix() {
    this.spinnerService.start();
    const projectId = this.projectTableService.getCurrentProjectById();
  
    Promise.all([
      firstValueFrom(this.traceabilityService.getTraceabilityMatrix(projectId)),
      this.requirementsService.getRequirementsByProjectId(projectId),
      this.artifactService.getArtifactsByProjectRelated(projectId),
      this.userService.getUsers()
    ])
    .then(([matrix, requirements, artifacts, users]) => {
      this.dataSource = matrix;
      this.currentProject = this.projectTableService.getCurrentProjectByName();
      
      this.requirementsData = requirements;
      this.artifactsData = artifacts;
      this.usersData = users;
  
      // Processamento dos dados para relationsIdentifierAndName e userName
      this.requirementsData.forEach(req => {
        this.relationsIdentifierAndName[req.identifier] = req.name;
      });
  
      this.artifactsData.forEach(art => {
        this.relationsIdentifierAndName[art.identifier] = art.name;
      });
  
      this.usersData.forEach(t => {
        this.userName[t.id] = t.name;
      });
  
      // Atualizando o requirementId com os dados dos requisitos
      this.artifactsData.forEach(art => {
        if (art.requirementId) {
          const requirement = this.requirementsData.find(req => req.id === art.requirementId);
          if (requirement) {
            art.requirementId = requirement.identifier + " - " + requirement.name;
          }
        }
      });
  
      // Atualizando o author dos requisitos com o nome do usuário
      this.requirementsData.forEach(req => {
        if (req.author && this.userName[req.author]) {
          req.author = this.userName[req.author];
        }
      });
    })
    .catch(error => {
      console.error('Erro ao carregar os dados:', error);
    })
    .finally(() => {
      // Só para o spinner quando todos os dados foram carregados e processados
      this.spinnerService.stop();
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

    // Verifique se a célula é um identificador e abra o modal
    else if (cellValue !== null && cellValue !== '') {
      this.openModal(cellValue);
    }
  }

  openModal(identifier: string): void {
    this.spinnerService.start();

    if (identifier.startsWith('RF') || identifier.startsWith('RNF')) {

      const requirement = this.requirementsData.find(req => req.identifier === identifier);
      if (requirement) {

        this.spinnerService.stop();
        this.dialog.open(ModalDialogInformationRequirementComponent, {
          width: '1350px',
          data: requirement,
          disableClose: true
        });
      } else {

        this.spinnerService.stop();
        console.error('Requisito não encontrado:', identifier);
      }
    } else {

      const artifact = this.artifactsData.find(art => art.identifier === identifier);
      if (artifact) {

        this.spinnerService.stop();
        this.dialog.open(ModalDialogInformationRequirementArtifactComponent, {
          width: '1350px',
          data: artifact,
          disableClose: true
        });
      } else {

        this.spinnerService.stop();
        console.error('Artefato não encontrado:', identifier);
      }
    }
  }


  isRelated(rowIndex: number, colIndex: number): boolean {
    if (this.highlightedRow === null || this.highlightedColumn === null) {
      return false;
    }
    return (rowIndex === this.highlightedRow && colIndex < this.highlightedColumn) || 
           (colIndex === this.highlightedColumn && rowIndex < this.highlightedRow);
  }

  isHeader(rowIndex: number, colIndex: number): boolean {
    if (this.highlightedRow === null || this.highlightedColumn === null) {
      return false;
    }
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
