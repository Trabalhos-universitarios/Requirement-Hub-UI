import {HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {BehaviorSubject, catchError, firstValueFrom, Observable, throwError} from 'rxjs';
import { ArtifactProjectDataModel } from 'src/app/models/artifact-project-model';
import { ArtifactResponseModel } from 'src/app/models/artifact-response-model';
import { environmentLocal } from 'src/environment/environment-local';
import {ErrorCode} from "@angular/compiler-cli/src/ngtsc/diagnostics";

@Injectable({
  providedIn: 'root'
})
export class ArtifactProjectService {

  private baseUrl = environmentLocal.springUrl
  
  private formGroupSource = new BehaviorSubject<FormGroup>(new FormGroup({}));
  currentForm = this.formGroupSource.asObservable();

  constructor(private http: HttpClient) {}

  //SERVIÇOS DO FORMULÁRIO
  updateForm(formGroup: FormGroup) {
    this.formGroupSource.next(formGroup);
  }

  createArtifact(post: any): Promise<any> {
    return firstValueFrom(
        this.http.post(`${this.baseUrl}/project-artifacts`, post).pipe(
            catchError((error: HttpErrorResponse) => {

              console.log("SERVICE ERROR: ", error.status)
              console.log("SERVICE ERROR MESSAGE: ", error.message)

              if (error.status === 409) {
                console.error('This requirement already exists!');
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

  getArtifacts(): Observable<ArtifactProjectDataModel[]> {
    return this.http.get<ArtifactProjectDataModel[]>(`${this.baseUrl}/project-artifacts/all`);
  }

  getArtifactById(Id: number) {
    return firstValueFrom(this.http.get<ArtifactResponseModel>(`${this.baseUrl}/project-artifacts/${Id}`));
  }

  getArtifactByProjectId(projectId: number) {
    return firstValueFrom(this.http.get<ArtifactProjectDataModel[]>(`${this.baseUrl}/project-artifacts/by-project/${projectId}`));
  }

  getDownloadArtifactById(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/project-artifacts/download/${id}`, { responseType: 'blob' });
  }

  deleteArtifactById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/project-artifacts/${id}`);
  }
}

