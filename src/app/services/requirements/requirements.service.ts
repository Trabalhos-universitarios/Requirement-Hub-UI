import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode} from "@angular/common/http";
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

    updateForm(formGroup: FormGroup) {
        this.formGroupSource.next(formGroup);
    }

    async getAllRequirements(): Promise<RequirementsDataModel[]> {
        return firstValueFrom(this.http.get<RequirementsDataModel[]>(`${this.baseUrl}/requirements`))
    }

    async getRequirementsByProjectRelated(projectId: number): Promise<RequirementsDataModel[]> {
        return firstValueFrom(this.http.get<RequirementsDataModel[]>(`${this.baseUrl}/requirements/project-id/${projectId}`))
    }

    getRequirementsByIdentifier(id: number | undefined): Observable<RequirementsDataModel[]> {
        return this.http.get<RequirementsDataModel[]>(`${this.baseUrl}/requirements/${id}`);
    }

    async createRequirements(post: any): Promise<RequirementsDataModel[] | any> {
        return firstValueFrom(
            this.http.post(`${this.baseUrl}/requirements`, post).pipe(
                catchError((error: HttpErrorResponse) => {

                    if (error.status === 409) {
                        console.error('This requirement already exists!');
                        return throwError(() => HttpStatusCode.Conflict);
                    }
                    if (error.status === 404 || error.status === 405) {
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

    async deleteRequirement(id: number): Promise<any> {
        return firstValueFrom(this.http.delete(`${this.baseUrl}/requirements/${id}`));
    }
}
