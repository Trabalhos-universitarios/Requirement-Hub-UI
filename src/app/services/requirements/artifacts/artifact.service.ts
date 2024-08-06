import { Injectable } from '@angular/core';
import {BehaviorSubject, firstValueFrom, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import {
  RequirementsDataModel
} from "../../../models/requirements-data-model";
import {ArtifactResponseModel} from "../../../models/artifact-response-model";

@Injectable({
  providedIn: 'root'
})
export class ArtifactService {

  private baseUrl = 'http://localhost:8180';
  private formGroupSource = new BehaviorSubject<FormGroup | null>(null);
  currentForm = this.formGroupSource.asObservable();

  constructor(private http: HttpClient) {}

  //SERVIÇOS DO FORMULÁRIO
  updateForm(formGroup: FormGroup) {
    this.formGroupSource.next(formGroup);
  }

  createArtifact(post: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/artifacts`, post);
  }

  getArtifactByIdentifierArtifact(identifier: string) {

    console.log(`artifact identifier dentro da service: ${identifier}`)

    const params = new HttpParams().set('identifier', identifier);
    return firstValueFrom(this.http.get<ArtifactResponseModel[]>(`${this.baseUrl}/artifacts/filter`, { params }));
  }
}
