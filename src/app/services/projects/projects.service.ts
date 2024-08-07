import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environmentLocal} from "../../../environment/environment-local";
import { ProjectDataModel } from 'src/app/models/project-data-model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private baseUrl = environmentLocal.apiUrl

  constructor(private http: HttpClient) {}

  getProjects(): Observable<ProjectDataModel[]> {
    return this.http.get<ProjectDataModel[]>(`${this.baseUrl}/project/all`);
  }

  createProject(post: any): Observable<any> {

    console.log('VALOR DENTRO DA SERVICE ', post)

    return this.http.post(`${this.baseUrl}/project`, post);
  }
}
