import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, firstValueFrom, Observable} from "rxjs";
import {FormGroup} from "@angular/forms";
import {
  RequirementsDataModel
} from "../../components/tables/requirements/requirements-table/model/requirements-data-model";

@Injectable({
  providedIn: 'root'
})
export class RequirementsService {

  private formGroupSource = new BehaviorSubject<FormGroup | null>(null);
  currentForm = this.formGroupSource.asObservable();
  private baseUrl = 'http://localhost:8180';
  // private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  //SERVIÇOS DO FORMULÁRIO
  updateForm(formGroup: FormGroup) {
    this.formGroupSource.next(formGroup);
  }

  //SERVIÇOS DE DB
  getRequirements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/requirements/search`);
  }

  async getRequirementsByIdentifier(identifier: string): Promise<RequirementsDataModel[]> {
    const params = new HttpParams().set('identifier', identifier);
    return firstValueFrom(this.http.get<RequirementsDataModel[]>(`${this.baseUrl}/requirements/filter`, { params }));
  }

  createRequirements(post: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/requirements`, post);
  }
}
