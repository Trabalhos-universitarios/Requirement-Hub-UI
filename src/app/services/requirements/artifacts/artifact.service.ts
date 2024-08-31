import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, firstValueFrom, Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import {
  RequirementsDataModel
} from "../../../models/requirements-data-model";
import {ArtifactResponseModel} from "../../../models/artifact-response-model";
import {environmentLocal} from "../../../../environment/environment-local";

@Injectable({
  providedIn: 'root'
})
export class ArtifactService {

  private baseUrl = environmentLocal.springUrl;
  private formGroupSource = new BehaviorSubject<FormGroup | null>(null);
  currentForm = this.formGroupSource.asObservable();

  constructor(private http: HttpClient) {}

  //SERVIÇOS DO FORMULÁRIO
  updateForm(formGroup: FormGroup) {
    this.formGroupSource.next(formGroup);
  }

  async createArtifact(post: any): Promise<any> {
    return firstValueFrom(
        this.http.post(`${this.baseUrl}/requirement-artifacts`, post).pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status === 409) {
                console.error('This artifact requirement already exists!');
                return throwError(() => HttpStatusCode.Conflict);
              } if (error.status === 404 || error.status === 405) {
                console.error('This route not exists or not starting!');
                return throwError(() => HttpStatusCode.NotFound);
              } else if (error.status === 500 || error.status === 503) {
                console.error('Internal server error!');
                return throwError(() => HttpStatusCode.InternalServerError);
              }
              return throwError(() => new Error(error.message));
            })
        )
    );
  }

  async getArtifactByIdentifierArtifact(Identifier: number)  {
    return firstValueFrom(this.http.get<ArtifactResponseModel>(`${this.baseUrl}/requirement-artifacts/${Identifier}`));
  }

  async getArtifactById(id?: string)  {
    return firstValueFrom(this.http.get<ArtifactResponseModel>(`${this.baseUrl}/requirement-artifacts/${id}`));
  }

  async getArtifactByRequirementId(requirementId?: number) {
    return firstValueFrom(this.http.get<ArtifactResponseModel[]>(`${this.baseUrl}/requirement-artifacts/by-requirement/${requirementId}`));
  }

  async getArtifactsByProjectRelated(projectId: number) {
    return firstValueFrom(this.http.get<ArtifactResponseModel[]>(`${this.baseUrl}/requirement-artifacts/by-project/${projectId}`));
  }

  updateArtifact(id?: string, artifact?: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/requirement-artifacts/${id}`, artifact)
}

  deleteArtifactById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/requirement-artifacts/${id}`);
  }
}
