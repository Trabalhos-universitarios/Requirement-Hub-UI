import { Injectable } from '@angular/core';
import {BehaviorSubject, firstValueFrom, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
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

  createArtifact(post: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/requirement-artifacts`, post);
  }

  async getArtifactByIdentifierArtifact(id: number)  {
    return firstValueFrom(this.http.get<ArtifactResponseModel>(`${this.baseUrl}/requirement-artifacts/${id}`));
  }

  async getArtifactByRequirementId(requirementId?: number) {
    return firstValueFrom(this.http.get<ArtifactResponseModel[]>(`${this.baseUrl}/requirement-artifacts/by-requirement/${requirementId}`));
  }

  deleteArtifactById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/requirement-artifacts/${id}`);
  }
}
