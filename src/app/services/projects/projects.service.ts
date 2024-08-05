import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CreateProjectDataModel} from "../../models/create-project-data-model";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private baseUrl = 'http://localhost:3000';
  // private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<CreateProjectDataModel[]> {
    return this.http.get<CreateProjectDataModel[]>(`${this.baseUrl}/projects`);
  }

  createProject(post: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/projects`, post);
  }
}
