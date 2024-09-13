import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {BehaviorSubject, catchError, firstValueFrom, Observable, throwError} from "rxjs";
import {RequirementsDataModel} from "../../models/requirements-data-model";
import {environmentLocal} from "../../../environment/environment-local";

@Injectable({
    providedIn: 'root'
})
export class RequirementsHistoryService {

    private _currentForm = new BehaviorSubject<any>({});
    currentForm = this._currentForm.asObservable();
    _verificationsFormValid = new BehaviorSubject<any>({});
    verificationsFormValid = this._verificationsFormValid.asObservable();
    private baseUrl = environmentLocal.springUrl;

    constructor(private http: HttpClient) {}

    verifierFormValid(formValid: boolean) {
        this._verificationsFormValid.next(formValid);
    }

    updateForm(formValue: RequirementsDataModel | any) {
        this._currentForm.next(formValue);
    }

    async getRequirementHistoryByIdentifier(identifier: string, projectId : number): Promise<RequirementsDataModel[]> {
        return firstValueFrom(this.http.get<RequirementsDataModel[]>(`${this.baseUrl}/requirement-history/${identifier}/${projectId}`))
    }

    async deleteHistory(id: number): Promise<any> {
        return firstValueFrom(this.http.delete(`${this.baseUrl}/requirement-history/${id}`));
    }
}