import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ModalDialogInformationRequirementComponent } from 'src/app/components/modals/requirements/modal-dialog-information-requirement/modal-dialog-information-requirement.component';
import { RequirementHistoryTableComponent } from 'src/app/components/tables/requirements/requirement-history-table/requirement-history-table.component';
import { ProjectDataModel } from 'src/app/models/project-data-model';
import { RequirementsDataModel } from 'src/app/models/requirements-data-model';
import { CapitalizeFirstPipePipe } from 'src/app/pipes/capitalize-first-pipe.pipe';
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { RequirementsService } from 'src/app/services/requirements/requirements.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { AlertService } from 'src/app/services/sweetalert/alert.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { UsersService } from 'src/app/services/users/users.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProjectsTableService } from 'src/app/services/projects/projects-table.service';

@Component({
  selector: 'app-approval-flow',
  templateUrl: './approval-flow.component.html',
  styleUrls: ['./approval-flow.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ApprovalFlowComponent implements AfterViewInit {
  protected displayedColumns: string[] = [
    'identifier', 'name', 'author', 'dateCreated', 'priority', 'type', 'version', 'status'
  ];
  protected columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  protected dataSource = new MatTableDataSource<RequirementsDataModel>([]);
  protected expandedElement: RequirementsDataModel | undefined;
  protected projects = new MatTableDataSource<ProjectDataModel>([]);
  protected selectedProjectId: number | undefined;
  protected selectedProjectName: string = '';
  
  // Cache para armazenar dados de requisitos por projeto
  protected requirementsCache: { [projectId: number]: RequirementsDataModel[] } = {};

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private requirementsService: RequirementsService,
    private sanitizer: DomSanitizer,
    private themeService: ThemeService,
    private matDialog: MatDialog,
    private projectsService: ProjectsService,
    private usersService: UsersService,
    private spinnerService: SpinnerService,
    private capitalizeFirstPipe: CapitalizeFirstPipePipe,
    private alertService: AlertService,
    private localStorage: LocalStorageService,
    private projectsTableService: ProjectsTableService
  ) {
    spinnerService.start();
    this.getProjects().then();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  protected async getProjects() {
    try {
      const managerId = this.localStorage.getItem('id');
      const projects = await this.projectsService.getProjectsByManagerId(managerId);

      if (projects.length > 0) {
        projects.sort((a, b) => a.id - b.id);
        this.selectedProjectId = projects[0].id;
        this.selectedProjectName = projects[0].name;
        this.onProjectChange();
      }

      this.projects.data = projects;
    } catch (error) {
      console.error(`Error loading projects: ${error}`);
      this.spinnerService.stop();
    }
  }

  protected async onProjectChange() {
    if (!this.selectedProjectId) return;

    this.spinnerService.start();
    try {
      this.setDataProjectTable(this.selectedProjectId, this.selectedProjectName)
      if (this.requirementsCache[this.selectedProjectId]) {
        // Usar cache se os dados já estiverem disponíveis para o projeto selecionado
        this.dataSource.data = this.requirementsCache[this.selectedProjectId];
      } else {
        // Buscar dados do backend se não estiver no cache
        const requirements = await this.requirementsService.getRequirementsByProjectId(this.selectedProjectId);
        const filteredRequirements = requirements.filter(req =>
          req.status === 'PENDING' || req.status === 'BLOCKED'
        );

        this.dataSource.data = filteredRequirements;
        this.requirementsCache[this.selectedProjectId] = filteredRequirements;  // Armazenar no cache

        // Atualizar autores dos requisitos, se necessário
        filteredRequirements.forEach(async (requirement) => {
          if (requirement.author) {
            const requirementIndex = this.dataSource.data.findIndex(r => r.identifier === requirement.identifier);
            if (requirementIndex > -1) {
              this.dataSource.data[requirementIndex].author = await this.getAuthorById(requirement.author).then();
              this.dataSource._updateChangeSubscription();  // Atualizar tabela
            }
          }
        });

        this.dataSource.data.sort((a, b) => a.identifier.localeCompare(b.identifier));
      }
    } catch (error) {
      console.error(`Error loading requirements for project ${this.selectedProjectId}: ${error}`);
    } finally {
      this.spinnerService.stop();
    }
  }

  private async getAuthorById(authorId: number): Promise<string> {
    try {
      const user = await this.usersService.getUserById(authorId);
      return this.capitalizeFirstPipe.transform(user.name);
    } catch (error) {
      console.error(`Error fetching author with ID ${authorId}: ${error}`);
      return 'Unknown';
    }
  }

  protected sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  isPermitted() {
    return !(this.localStorage.getItem('role') === "GERENTE_DE_PROJETOS");
  }

  protected getStatusIcon(status: string) {
    switch (status) {
      case "ACTIVE":
        return { icon: 'verified', name: 'ACTIVE' };
      case "REJECTED":
        return { icon: 'do_not_disturb_on', name: 'REJECTED' };
      case "PENDING":
        return { icon: 'schedule', name: 'PENDING' };
      case "APPROVE":
        return { icon: 'preliminary', name: 'APPROVE' };
      case "CREATED":
        return { icon: 'pending', name: 'CREATED' };
      case "BLOCKED":
        return { icon: 'block', name: 'BLOCKED' };
      default:
        return { icon: 'help', name: 'UNKNOWN' };
    }
  }

  protected stylesIconColor(iconName: string) {
    let colorIcon: string = '#616161';
    if (this.themeService.isDarkMode()) {
      colorIcon = '#e0e0e0';
    }
    switch (iconName) {
      case 'verified':
        return { color: '#4CAF50' };
      case 'pending_actions':
        return { color: `${colorIcon}` };
      case 'schedule':
        return { color: '#FFD54F' };
      case 'preliminary':
        return { color: '#4CAF50' };
      case 'pending':
        return { color: '#A5D6A7' };
      case 'do_not_disturb_on':
      case 'block':
        return { color: 'rgba(253,0,0,0.74)' };
      default:
        return { color: `${colorIcon}` };
    }
  }

  protected async openDialog(action: String, value: RequirementsDataModel) {
    switch (action) {
      case "information":
        this.matDialog.open(ModalDialogInformationRequirementComponent, {
          data: value,
          width: '1200px',
          disableClose: true
        });
        break;
      case "approval":
        // Código para abrir o diálogo de aprovação
        break;
      case "history":
        this.matDialog.open(RequirementHistoryTableComponent, {
          data: value,
          disableClose: true
        });
        break;
      default:
        console.error("This dialog does not exist!");
    }
  }

  setDataProjectTable(id: number, currentProject: string) {
    this.projectsTableService.setCurrentProjectById(id);
    this.projectsTableService.setCurrentProjectByName(currentProject);
  }
}
