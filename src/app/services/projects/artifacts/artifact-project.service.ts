import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { ArtifactProjectDataModel } from 'src/app/models/artifact-project-model';
import { ArtifactResponseModel } from 'src/app/models/artifact-response-model';
import { environmentLocal } from 'src/environment/environment-local';
import {ErrorCode} from "@angular/compiler-cli/src/ngtsc/diagnostics";
import { ArtifactResponseModel } from 'src/app/models/artifact-response-model';

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

  createArtifact(post: any): Observable<any> {
    console.log(post)
    return this.http.post(`${this.baseUrl}/project-artifacts`, post);
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

