import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {DataModel} from "../../components/tables/projects/create-project-table/data-model";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class RequirementsService {

  private formGroupSource = new BehaviorSubject<FormGroup | null>(null);
  currentForm = this.formGroupSource.asObservable();
  private baseUrl = 'http://localhost:8180';

  constructor(private http: HttpClient) {}

  //SERVIÇOS DO FORMULÁRIO
  updateForm(formGroup: FormGroup) {
    this.formGroupSource.next(formGroup);
  }

  //SERVIÇOS DE DB
  getRequirements(): Observable<DataModel[]> {
    return this.http.get<DataModel[]>(`${this.baseUrl}/requirements`);
  }

  getRequirementsByName(nameRequirement: string): Observable<any> {
    const encodedName = encodeURIComponent(nameRequirement);
    return this.http.get<any>(`${this.baseUrl}/requirements/filter?nameRequirement=${encodedName}`);
  }

  createRequirements(post: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/requirements`, post);
  }
}
