import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environmentLocal} from "../../../environment/environment-local";
import { CreateProjectDataModel } from 'src/app/models/create-project-data-model';
import { ProjectsTableService } from './projects-table.service';
import { UserResponseModel } from 'src/app/models/user-model';

@Injectable({
  providedIn: 'root'
})
export class UpdateProjectsService {

  private baseUrl = environmentLocal.springUrl
  private currentProjectTeam: UserResponseModel[] = [];

  constructor(private http: HttpClient, private projectTableService : ProjectsTableService) {}

  getProject(): Observable<CreateProjectDataModel> {
    return this.http.get<CreateProjectDataModel>(`${this.baseUrl}/project/${this.projectTableService.getCurrentProjectById()}`);
  }

  updateProject(id: number, project: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/project/${id}`, project);
  }

  setCurrentProjectTeam(teams: UserResponseModel[]) {
    this.currentProjectTeam = teams;
}

  getCurrentProjectTeam(){
    return this.currentProjectTeam;
  }
}
