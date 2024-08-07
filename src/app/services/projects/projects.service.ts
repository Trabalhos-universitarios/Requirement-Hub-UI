import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CreateProjectDataModel} from "../../models/create-project-data-model";
import {environmentLocal} from "../../../environment/environment-local";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private baseUrl = environmentLocal.springUrl

  constructor(private http: HttpClient) {}

  getProjects(): Observable<CreateProjectDataModel[]> {
    return this.http.get<CreateProjectDataModel[]>(`${this.baseUrl}/project`);
  }

  createProject(post: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/project`, post);
  }
}
