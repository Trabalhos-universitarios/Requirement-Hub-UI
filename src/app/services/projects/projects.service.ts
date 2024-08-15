import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {environmentLocal} from "../../../environment/environment-local";
import { ProjectDataModel } from 'src/app/models/project-data-model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private formGroupSource = new BehaviorSubject<FormGroup | null>(null);
  currentForm = this.formGroupSource.asObservable();

  private baseUrl = environmentLocal.springUrl

  constructor(private http: HttpClient) {}


  //SERVIÇOS DO FORMULÁRIO
  updateForm(formGroup: FormGroup) {
    this.formGroupSource.next(formGroup);
  }

  getProjects(): Observable<ProjectDataModel[]> {
    return this.http.get<ProjectDataModel[]>(`${this.baseUrl}/project/all`);
  }

  createProject(post: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/project`, post);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/project/${id}`);
  }
}
