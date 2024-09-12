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
  colorScheme: Color = {
    name: this.themeService.isDarkMode() ? 'dark' : 'light',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#1E88E5', '#D32F2F', '#FFC107', '#43A047']
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

  setChartColors(): void {
    const isDarkMode = this.themeService.isDarkMode();
    
    this.colorScheme = {
      name: isDarkMode ? 'dark' : 'light',
      selectable: true,
      group: ScaleType.Ordinal,
      domain: isDarkMode 
        ? ['#90caf9', '#f48fb1', '#ffb74d', '#4caf50', '#ff7043', '#b39ddb']
        : ['#1E88E5', '#D32F2F', '#FFC107', '#43A047', '#FB8C00', '#8E24AA']
    };
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
      this.pieChartData = [];
      this.barChartData = [];
      this.spinnerService.stop();
    }
  }

  onProjectChange(projectId: number) {
    if (this.requirementsCache[projectId]) {
      this.updateCharts(projectId);
    }
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

      this.pieChartData = Object.keys(statusCount).map(status => ({
        name: `${status}`,
        value: statusCount[status]
      }));
    } else {
      this.pieChartData = [];
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
