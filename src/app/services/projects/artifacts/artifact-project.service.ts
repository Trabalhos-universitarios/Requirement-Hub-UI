import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { ArtifactProjectDataModel } from 'src/app/models/artifact-project-model';
import { environmentLocal } from 'src/environment/environment-local';

@Injectable({
  providedIn: 'root'
})
export class ArtifactProjectService {

  private baseUrl = environmentLocal.springUrl
  
  private formGroupSource = new BehaviorSubject<FormGroup | null>(null);
  currentForm = this.formGroupSource.asObservable();

  constructor(private http: HttpClient) {}

  //SERVIÇOS DO FORMULÁRIO
  updateForm(formGroup: FormGroup) {
    this.formGroupSource.next(formGroup);
  }

  createArtifact(post: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/project/artifacts`, post);
  }

  getArtifactByIdentifierArtifact(identifier: string) {
    const params = new HttpParams().set('identifier', identifier);
    return firstValueFrom(this.http.get<ArtifactProjectDataModel[]>(`${this.baseUrl}/artifacts/filter`, { params }));
  }
}

