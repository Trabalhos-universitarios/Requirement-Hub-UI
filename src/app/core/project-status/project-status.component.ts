import { Component, OnInit } from '@angular/core';
import { RequirementsService } from 'src/app/services/requirements/requirements.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { RequirementsDataModel } from 'src/app/models/requirements-data-model';
import { ProjectDataModel } from 'src/app/models/project-data-model';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss']
})
export class ProjectStatusComponent implements OnInit {
  projects: ProjectDataModel[] = [];
  selectedProjectId: number | null = null;
  requirementsCache: { [projectId: number]: RequirementsDataModel[] } = {};  // Cache para os requisitos por projeto
  allResponsiblesCache: any[] = [];  // Cache para os responsáveis
  pieChartData: any[] = [];  
  barChartData: any[] = [];  
  totalRequirements: number = 0;  // Total de requisitos para o gráfico de pizza

  // Mapa de cores para os diferentes status
  statusColorMapLight: { [key: string]: string } = {
    'REFUSE': '#F44336',  // Vermelho
    'PENDING': '#FF9800',  // Laranja
    'CREATED': '#2196F3',  // Azul
    'ACTIVE': '#4CAF50',  // Verde
    'BLOCKED': '#9E9E9E'  // Cinza
  };

  statusColorMapDark: { [key: string]: string } = {
    'REFUSE': '#D32F2F',  // Vermelho um pouco mais escuro
    'PENDING': '#F57C00',  // Laranja mais escuro
    'CREATED': '#1976D2',  // Azul mais profundo
    'ACTIVE': '#388E3C',  // Verde mais fechado
    'BLOCKED': '#9E9E9E'  // Cinza
  };

  // Definimos o esquema de cores com o domínio vazio, pois será preenchido dinamicamente
  colorScheme: Color = {
    name: 'dynamic',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: []  // Será preenchido dinamicamente
  };

  isLoading: boolean = false;
  themeSubscription: Subscription | undefined;

  constructor(
    private requirementsService: RequirementsService,
    private projectsService: ProjectsService,
    private spinnerService: SpinnerService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.spinnerService.start();
    this.setChartColors(); 
    this.loadProjects();
    this.loadResponsibles();  // Carrega os responsáveis uma única vez

    this.themeSubscription = this.themeService.getColorThemeObservable().subscribe(() => {
      this.setChartColors();
    });
  }

  // Função para carregar todos os responsáveis apenas uma vez
  async loadResponsibles() {
    if (this.allResponsiblesCache.length === 0) {
      const responsiblesData = await this.requirementsService.getAllRequirementResponsibles();
      this.allResponsiblesCache = responsiblesData;
    }
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  // Função para definir as cores do gráfico com base no tema
  setChartColors(): void {
    const isDarkMode = this.themeService.isDarkMode();
    
    const colorMap = isDarkMode ? this.statusColorMapDark : this.statusColorMapLight;

    this.colorScheme = {
      name: 'dynamic',
      selectable: true,
      group: ScaleType.Ordinal,
      domain: Object.values(colorMap)  // Preenche com as cores do mapa
    };

    // Atualiza o gráfico com as novas cores
    if (this.selectedProjectId) {
      this.updateCharts(this.selectedProjectId);
    }
  }

  async loadProjects() {
    const allProjects = await this.projectsService.getProjects();

    const projectsWithRequirements = await Promise.all(
      allProjects.map(async (project) => {
        const requirements = await this.requirementsService.getRequirementsByProjectId(project.id);
        if (requirements.length > 0) {
          this.requirementsCache[project.id] = requirements; // Armazena os requisitos em cache
          return project;
        }
        return null;
      })
    );

    this.projects = projectsWithRequirements.filter(project => project !== null) as ProjectDataModel[];

    if (this.projects.length > 0) {
      this.selectedProjectId = this.projects[0].id;
      this.updateCharts(this.selectedProjectId);
      this.spinnerService.stop();
    } else {
      this.selectedProjectId = null;
      this.resetData();  // Limpa os dados se não houver projetos
      this.spinnerService.stop();
    }
  }

  onProjectChange(projectId: number) {
    this.resetData(); // Reseta os dados antes de carregar novos
    if (this.requirementsCache[projectId]) {
      this.updateCharts(projectId);
    }
  }

  resetData() {
    this.pieChartData = [];
    this.barChartData = [];
    this.totalRequirements = 0;
  }

  updateCharts(projectId: number) {
    if (this.requirementsCache[projectId]) {
      this.getRequirementsStatusByProject(this.requirementsCache[projectId]);
      this.getRequirementsByResponsible(this.requirementsCache[projectId]);
    }
  }

  getRequirementsStatusByProject(requirements: RequirementsDataModel[]) {
    if (requirements && requirements.length > 0) {
      const statusCount: { [key: string]: number } = requirements.reduce((acc: { [key: string]: number }, requirement) => {
        if (requirement.status) {
          acc[requirement.status] = (acc[requirement.status] || 0) + 1;
        }
        return acc;
      }, {});

      // Verifica o tema e usa o mapa de cores adequado
      const isDarkMode = this.themeService.isDarkMode();
      const colorMap = isDarkMode ? this.statusColorMapDark : this.statusColorMapLight;

      // Monta os dados do gráfico de pizza e mapeia a cor para cada status
      this.pieChartData = Object.keys(statusCount).map(status => ({
        name: `${status}`,
        value: statusCount[status],
        color: colorMap[status]  // Atribui a cor do mapa de acordo com o tema
      }));

      // Atualiza o esquema de cores dinamicamente
      this.colorScheme.domain = Object.keys(statusCount).map(status => colorMap[status]);

      // Calcula o total de requisitos
      this.totalRequirements = requirements.length;
    } else {
      this.resetData();
    }
  }

  getRequirementsByResponsible(requirements: RequirementsDataModel[]) {
    if (requirements && requirements.length > 0) {
      const requirementIds = requirements.map(req => req.id);

      // Usar o cache dos responsáveis carregado uma vez
      const filteredResponsibles = this.allResponsiblesCache.filter((responsible: any) => 
        requirementIds.includes(responsible[0])
      );

      const responsibleCount: { [key: string]: { name: string, count: number } } = filteredResponsibles.reduce((acc: { [key: string]: { name: string, count: number } }, responsible: any) => {
        const userId = responsible[1];
        const userName = responsible[2];
        if (!acc[userId]) {
          acc[userId] = { name: userName, count: 0 };
        }
        acc[userId].count += 1;
        return acc;
      }, {});

      this.barChartData = Object.keys(responsibleCount).map(userId => ({
        name: responsibleCount[userId].name,
        value: responsibleCount[userId].count
      }));
    } else {
      this.barChartData = [];
    }
  }
}
