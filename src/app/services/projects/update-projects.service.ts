import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environmentLocal} from "../../../environment/environment-local";
import { CreateProjectDataModel } from 'src/app/models/create-project-data-model';
import { ProjectsTableService } from './projects-table.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateProjectsService {

  private baseUrl = environmentLocal.springUrl

  constructor(private http: HttpClient, private projectTableService : ProjectsTableService ) {}

  getProject(): Observable<CreateProjectDataModel> {
    return this.http.get<CreateProjectDataModel>(`${this.baseUrl}/project/${this.projectTableService.getCurrentIdProject()}`);
  }

  updateProject(id: number, project: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/project/${id}`, project);
  }
}
