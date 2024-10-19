import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { RequirementsDataModel } from 'src/app/models/requirements-data-model';
import { RequirementsService } from 'src/app/services/requirements/requirements.service';
import { ProjectsTableService } from 'src/app/services/projects/projects-table.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';
import { UsersService } from 'src/app/services/users/users.service';
import { UserResponseModel } from 'src/app/models/user-model';

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
  users: UserResponseModel[] = [];  // Nova variável para armazenar os usuários

  columns: Column[] = [
    { name: 'BACKLOG', requisitos: this.backlog, maxItems: 10, id: 'backlog' },
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
    this.users = await this.usersService.getUsers();
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

  // Método para lidar com o evento de drag and drop
  drop(event: CdkDragDrop<RequirementsDataModel[]>, column: Column): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedRequirement = column.requisitos[event.currentIndex];

      // Se o requisito foi movido da coluna de BACKLOG, atribuir o ID do desenvolvedor
      const activeUserId = this.localStorageService.getItem('id');
      if (event.previousContainer.id === 'backlog' && activeUserId && movedRequirement.developerAssigned == null) {
        movedRequirement.developerAssigned = activeUserId;

        // Chama o novo método assignDeveloper para salvar o developerAssigned
        this.assignDeveloper(movedRequirement.id, activeUserId);
      }

      const newStatus = this.getStatusFromColumn(column);
      this.updateRequirementStatus(movedRequirement, newStatus);
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

  isPermitted(userId: number | undefined) {
    return !(this.localStorageService.getItem('role') == "GERENTE_DE_PROJETOS" ||
        this.localStorageService.getItem('role') == "COMUM_USER" && userId == this.localStorageService.getItem('id'))
}
}
