import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {catchError, firstValueFrom, Observable, throwError} from "rxjs";
import {environmentLocal} from "../../../environment/environment-local";
import { CreateProjectDataModel } from 'src/app/models/create-project-data-model';
import { ProjectsTableService } from './projects-table.service';
import { UserResponseModel } from 'src/app/models/user-model';
import {RequirementsDataModel} from "../../models/requirements-data-model";

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
    return this.http.put(`${this.baseUrl}/project/${id}`, project)
        .pipe(catchError((error: HttpErrorResponse) => {

          switch (error.status) {
            case 404:
              return throwError(() => HttpStatusCode.NotFound);
            case 405:
              return throwError(() => HttpStatusCode.MethodNotAllowed);
            case 500:
              return throwError(() => HttpStatusCode.InternalServerError);
            case 503:
              return throwError(() => HttpStatusCode.ServiceUnavailable);
            default:
              return throwError(() => new Error(error.message));
          }
        })
    )
  }

  setCurrentProjectTeam(teams: UserResponseModel[]) {
    this.currentProjectTeam = teams;
}

  getCurrentProjectTeam(){
    return this.currentProjectTeam;
  }
}
