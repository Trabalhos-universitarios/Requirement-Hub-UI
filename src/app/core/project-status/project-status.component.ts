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
  pieChartData: any[] = [];  // Para status dos requisitos
  barChartData: any[] = [];  // Para quantidade de requisitos por responsável
  colorScheme: Color = {
    name: this.themeService.isDarkMode() ? 'dark': 'light', 
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#1E88E5', '#D32F2F', '#FFC107', '#43A047']
  };

  // Variável de controle para o estado de carregamento
  isLoading: boolean = false;
  themeSubscription: Subscription |undefined;

  constructor(
    private requirementsService: RequirementsService,
    private projectsService: ProjectsService,
    private spinnerService: SpinnerService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.spinnerService.start();
    this.setChartColors();  // Define as cores iniciais
    this.loadProjects();

    // Subscreve às mudanças no tema para atualizar o esquema de cores dos gráficos dinamicamente
    this.themeSubscription = this.themeService.getColorThemeObservable().subscribe(() => {
      this.setChartColors();
    });
  }

  ngOnDestroy() {
    // Cancela a subscrição ao trocar de componente
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
        ? ['#90caf9', '#f48fb1', '#ffb74d', '#4caf50', '#ff7043', '#b39ddb'] // Cores para o modo escuro
        : ['#1E88E5', '#D32F2F', '#FFC107', '#43A047', '#FB8C00', '#8E24AA']  // Cores para o modo claro
    };
  }

  async loadProjects() {
    const allProjects = await this.projectsService.getProjects();
    
    const projectsWithRequirements = await Promise.all(
      allProjects.map(async (project) => {
        const requirements = await this.requirementsService.getRequirementsByProjectId(project.id);
        return requirements.length > 0 ? project : null;
      })
    );

    this.projects = projectsWithRequirements.filter(project => project !== null) as ProjectDataModel[];
  
    if (this.projects.length > 0) {
      this.selectedProjectId = this.projects[0].id;
      await this.loadProjectData(this.selectedProjectId);
      this.spinnerService.stop();
    } else {
      this.selectedProjectId = null;
      this.pieChartData = [];
      this.barChartData = [];
      console.log('Nenhum projeto com requisitos encontrado.');
      this.spinnerService.stop();
    }
  }

  async onProjectChange(projectId: number) {
    await this.loadProjectData(projectId);
  }

  async loadProjectData(projectId: number) {
    await this.getRequirementsStatusByProject(projectId);
    await this.getRequirementsByResponsible(projectId);
  }

  async getRequirementsStatusByProject(projectId: number) {
    const data: RequirementsDataModel[] = await this.requirementsService.getRequirementsByProjectId(projectId);
    
    if (data && data.length > 0) {
      const statusCount: { [key: string]: number } = data.reduce((acc: { [key: string]: number }, requirement) => {
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

  async getRequirementsByResponsible(projectId: number) {
    const data: RequirementsDataModel[] = await this.requirementsService.getRequirementsByProjectId(projectId);
  
    if (data && data.length > 0) {
      const requirementIds = data.map(req => req.id);
      const responsiblesData = await this.requirementsService.getAllRequirementResponsibles();

      if (responsiblesData && responsiblesData.length > 0) {
        const filteredResponsibles = responsiblesData.filter((responsible: any) => 
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
    } else {
      this.barChartData = [];
    }
  }
}
