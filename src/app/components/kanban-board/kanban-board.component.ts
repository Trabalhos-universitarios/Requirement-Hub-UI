import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { RequirementsDataModel } from 'src/app/models/requirements-data-model';
import { RequirementsService } from 'src/app/services/requirements/requirements.service';
import { ProjectsTableService } from 'src/app/services/projects/projects-table.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';
import { UsersService } from 'src/app/services/users/users.service';
import { TeamResponseModel } from 'src/app/models/user-team-model';

interface Column {
  name: string;
  requisitos: RequirementsDataModel[];
  maxItems: number;
  id: string;
}

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent implements OnInit {

  connectedTo: string[] = [];
  backlog: RequirementsDataModel[] = [];
  currentProject: string = '';
  users: TeamResponseModel[] = [];  // Nova variável para armazenar os usuários

  columns: Column[] = [
    { name: 'BACKLOG', requisitos: this.backlog, maxItems: 30, id: 'backlog' },
    { name: 'DEVELOPMENT', requisitos: [], maxItems: 6, id: 'development' },
    { name: 'TEST', requisitos: [], maxItems: 6, id: 'test' },
    { name: 'APPROVAL', requisitos: [], maxItems: 6, id: 'approval' },
    { name: 'IMPLANTATION', requisitos: [], maxItems: 6, id: 'implantation' },
  ];

  constructor(
    private requirementsService: RequirementsService,
    private projectsTableService: ProjectsTableService,
    private spinnerService: SpinnerService,
    private localStorageService: LocalStorageService,
    private usersService: UsersService  // Adicionar o serviço de usuários
  ) { 
    this.currentProject = this.projectsTableService.getCurrentProjectByName(); 
  }

  ngOnInit() {
    this.spinnerService.start();
    this.connectedTo = this.columns.map(column => column.id);
    this.loadBacklog();
    this.loadUsers();  // Carregar a lista de usuários
  }

  // Carregar a lista de usuários
  async loadUsers() {
    this.users = await this.usersService.getTeam(this.projectsTableService.getCurrentProjectById());
    this.spinnerService.stop();
  }

  // Carregar os requisitos e distribuí-los nas colunas com base no status
  async loadBacklog() {
    const currentProjectId = this.projectsTableService.getCurrentProjectById();

    if (currentProjectId) {
      const allRequirements = await this.requirementsService.getRequirementsByProjectId(currentProjectId);

      // Limpar todas as colunas antes de adicionar novos requisitos
      this.columns.forEach(column => column.requisitos = []);

      // Filtrar e distribuir os requisitos com base no status e no identifier 'RF'
      allRequirements.forEach(req => {
        console.log('Developer Assigned:', req.developerAssigned);
        if (req.identifier.startsWith('RF')) { // Filtrar pelos requisitos funcionais (RF)
          switch (req.status) {
            case 'ACTIVE':
              this.columns[0].requisitos.push(req); // BACKLOG
              break;
            case 'IN_PROGRESS':
              this.columns[1].requisitos.push(req); // DEVELOPMENT
              break;
            case 'IN_TEST':
              this.columns[2].requisitos.push(req); // TEST
              break;
            case 'IN_APPROVAL':
              this.columns[3].requisitos.push(req); // APPROVAL
              break;
            case 'DONE':
              this.columns[4].requisitos.push(req); // IMPLANTATION
              break;
            default:
              break;
          }
        }
      });
    }
  }

  drop(event: CdkDragDrop<RequirementsDataModel[]>, column: Column): void {
    const movedRequirement = event.previousContainer.data[event.previousIndex];
    const activeUserId = this.localStorageService.getItem('id');
    const userRole = this.localStorageService.getItem('role');
  
    // Verifica se o card já tem um developerAssigned
    if (movedRequirement.developerAssigned) {
      // Se não for o developerAssigned ou não for um GERENTE_DE_PROJETOS, impedir a movimentação
      if (movedRequirement.developerAssigned !== activeUserId && userRole !== 'GERENTE_DE_PROJETOS') {
        console.error('Apenas o responsável ou um gerente pode mover este card.');
        return;
      }
    }
  
    if (event.previousContainer === event.container) {
      // Movendo o item dentro da mesma coluna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Movendo o item para outra coluna
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
  
      const newStatus = this.getStatusFromColumn(column);
      movedRequirement.status = newStatus;  // Atualize o status localmente também para refletir a mudança visual
      
      // Atualize o status no backend e na interface
      this.updateRequirementStatus(movedRequirement, newStatus).then(() => {
        // Se o requisito foi movido da coluna de BACKLOG, atribuir o ID do desenvolvedor
        if (event.previousContainer.id === 'backlog' && activeUserId 
          && (movedRequirement.developerAssigned == null || movedRequirement.developerAssigned == 0) 
          && !(userRole === 'GERENTE_DE_PROJETOS')) {
          movedRequirement.developerAssigned = activeUserId;
  
          // Chama o método assignDeveloper para salvar o developerAssigned
          this.assignDeveloper(movedRequirement.id, activeUserId);
        }
      });
    }
  }  

  async assignDeveloper(requirementId: number | undefined, developerAssigned: number): Promise<void> {
    try {
      await this.requirementsService.assignDeveloper(requirementId, developerAssigned);
    } catch (error) {
      console.error('Erro ao atribuir o desenvolvedor', error);
    }
  }

  async updateRequirementStatus(requirement: RequirementsDataModel, newStatus: string): Promise<void> {
    try {
      await this.requirementsService.updateRequirementStatus(requirement.id, newStatus);
    } catch (error) {
      console.error('Erro ao atualizar o status do requisito', error);
    }
  }

  getStatusFromColumn(column: Column): string {
    switch (column.id) {
      case 'backlog':
        return 'ACTIVE';
      case 'development':
        return 'IN_PROGRESS';
      case 'test':
        return 'IN_TEST';
      case 'approval':
        return 'IN_APPROVAL';
      case 'implantation':
        return 'DONE';
      default:
        return 'ACTIVE'; 
    }
  }

  getCardClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'backlog';
      case 'IN_PROGRESS':
        return 'development';
      case 'IN_TEST':
        return 'test';
      case 'IN_APPROVAL':
        return 'approval';
      case 'DONE':
        return 'implantation';
      default:
        return '';  // Classe padrão se necessário
    }
  }
 
  isPermitted(userId: number | undefined) {
    return !(this.localStorageService.getItem('role') == "GERENTE_DE_PROJETOS" || userId == this.localStorageService.getItem('id'))
  }
}
