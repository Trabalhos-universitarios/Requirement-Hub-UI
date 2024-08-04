import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DataModel} from "../../components/tables/projects/create-project-table/data-model";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private baseUrl = 'http://localhost:3000';
  // private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<DataModel[]> {
    return this.http.get<DataModel[]>(`${this.baseUrl}/projects`);
  }

  createProject(post: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/projects`, post);
  }
}
