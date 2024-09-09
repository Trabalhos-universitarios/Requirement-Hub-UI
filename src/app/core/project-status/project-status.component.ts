import { Component, OnInit } from '@angular/core';
import { RequirementsService } from 'src/app/services/requirements/requirements.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { RequirementsDataModel } from 'src/app/models/requirements-data-model';
import { ProjectDataModel } from 'src/app/models/project-data-model';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss']
})
export class ProjectStatusComponent implements OnInit {
  projects: ProjectDataModel[] = [];  // Lista de projetos
  selectedProjectId: number | null = null;  // Projeto selecionado
  pieChartData: any[] = [];  // Para status dos requisitos
  barChartData: any[] = [];  // Para quantidade de requisitos por responsável
  colorScheme: Color = {
    name: 'dark',  // Nome do esquema de cores
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#1E88E5', '#D32F2F', '#FFC107', '#43A047'] // Paleta de cores ajustada
  };

  constructor(
    private requirementsService: RequirementsService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  // Função para carregar todos os projetos
  async loadProjects() {
    this.projects = await this.projectsService.getProjects();
    if (this.projects.length > 0) {
      this.selectedProjectId = this.projects[0].id;  // Seleciona o primeiro projeto por padrão
      this.loadProjectData(this.selectedProjectId);  // Carrega os dados do projeto selecionado
    }
  }

  // Função que dispara quando o projeto é alterado
  onProjectChange(projectId: number) {
    this.loadProjectData(projectId);  // Recarrega os dados com base no novo projeto selecionado
  }

  // Função para carregar os dados do projeto selecionado
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
      this.pieChartData = [];  // Limpa os dados se não houver requisitos
    }
  }

  async getRequirementsByResponsible(projectId: number) {
    // Obtém os requisitos do projeto selecionado
    const data: RequirementsDataModel[] = await this.requirementsService.getRequirementsByProjectId(projectId);
  
    // Log para verificar se os requisitos estão sendo obtidos corretamente
    console.log("Requisitos do projeto selecionado:", data);
  
    if (data && data.length > 0) {
      // Extrai os IDs dos requisitos do projeto selecionado
      const requirementIds = data.map(req => req.id);
      console.log("IDs dos requisitos do projeto:", requirementIds);
  
      // Obtém todos os responsáveis de todos os requisitos
      const responsiblesData = await this.requirementsService.getAllRequirementResponsibles();
  
      // Log para verificar se os dados de responsáveis estão sendo retornados
      console.log("Todos os responsáveis obtidos:", responsiblesData);
  
      if (responsiblesData && responsiblesData.length > 0) {
        // Filtra os responsáveis apenas pelos requisitos que pertencem ao projeto selecionado
        const filteredResponsibles = responsiblesData.filter((responsible: any) => 
          requirementIds.includes(responsible[0]) // Alterado aqui para acessar o requirement_id corretamente
        );
  
        // Log para verificar os responsáveis filtrados
        console.log("Responsáveis filtrados (apenas os do projeto selecionado):", filteredResponsibles);
  
        // Conta quantos requisitos estão associados a cada responsável
        const responsibleCount: { [key: string]: { name: string, count: number } } = filteredResponsibles.reduce((acc: { [key: string]: { name: string, count: number } }, responsible: any) => {
          const userId = responsible[1]; // Alterado para acessar o user_id corretamente
          const userName = responsible[2]; // Alterado para acessar o nome do usuário corretamente
          if (!acc[userId]) {
            acc[userId] = { name: userName, count: 0 };
          }
          acc[userId].count += 1;
          return acc;
        }, {});
  
        // Log para verificar a contagem dos responsáveis
        console.log("Contagem de responsáveis:", responsibleCount);
  
        // Converte os responsáveis para o formato esperado pelo gráfico
        this.barChartData = Object.keys(responsibleCount).map(userId => ({
          name: responsibleCount[userId].name,  // Usando o nome real do responsável
          value: responsibleCount[userId].count
        }));
  
        // Log para verificar os dados finais do gráfico
        console.log("Dados para o gráfico de responsáveis:", this.barChartData);
      } else {
        // Limpa os dados se não houver responsáveis encontrados
        this.barChartData = [];
        console.log("Nenhum responsável encontrado para os requisitos do projeto.");
      }
    } else {
      // Limpa os dados se não houver requisitos para o projeto selecionado
      this.barChartData = [];
      console.log("Nenhum requisito encontrado para o projeto selecionado.");
    }
  }
  
  
}
