import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {BehaviorSubject, catchError, firstValueFrom, Observable, throwError} from "rxjs";
import {FormGroup} from "@angular/forms";
import {
    RequirementsDataModel
} from "../../models/requirements-data-model";
import {environmentLocal} from "../../../environment/environment-local";

@Injectable({
    providedIn: 'root'
})
export class RequirementsService {

    private formGroupSource = new BehaviorSubject<FormGroup | null>(null);
    currentForm = this.formGroupSource.asObservable();
    private baseUrl = environmentLocal.springUrl;

    constructor(private http: HttpClient) {
    }

    //SERVIÇOS DO FORMULÁRIO
    updateForm(formGroup: FormGroup) {
        this.formGroupSource.next(formGroup);
    }

    //SERVIÇOS DE DB
    async getRequirements(): Promise<RequirementsDataModel[]> {
        return firstValueFrom(this.http.get<RequirementsDataModel[]>(`${this.baseUrl}/requirements`))
    }

    async getRequirementsByIdentifier(identifier: string): Promise<RequirementsDataModel[]> {
        const params = new HttpParams().set('identifier', identifier);
        return firstValueFrom(this.http.get<RequirementsDataModel[]>(`${this.baseUrl}/requirements/filter`, {params}));
    }

    createRequirements(post: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/requirements`, post)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 409) {
                        console.error('Requisito já existe');
                        return throwError('Requisito já existe');
                    }
                    return throwError(error);
                })
            );
    }
}
